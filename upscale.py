import torch
import numpy as np
from realesrgan import RealESRGANer
from basicsr.archs.rrdbnet_arch import RRDBNet
from PIL import Image
import sys
import os
import pytesseract
from pytesseract import Output
import cv2


if len(sys.argv) < 3:
    print("Usage: python upscale.py <input_image> <output_image>")
    sys.exit(1)

input_path = sys.argv[1]
output_path = sys.argv[2]


if not os.path.exists(input_path):
    print(f"Error: Input image not found at {input_path}")
    sys.exit(1)


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")


model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
model_path = r"D:\pbll\weights\RealESRGAN_x4plus.pth"

if not os.path.exists(model_path):
    print(f"Error: Model weights not found at {model_path}")
    sys.exit(1)


upsampler = RealESRGANer(
    scale=4,
    model_path=model_path,
    model=model,
    tile=512,  
    tile_pad=32,
    pre_pad=0,
    half=device.type == "cuda",
    device=device
)


image = Image.open(input_path).convert("RGB")
image_np = np.array(image)


def get_text_regions_mser(image):
    
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    mser = cv2.MSER_create()
    regions, _ = mser.detectRegions(gray)
    boxes = []
    for region in regions:
        x, y, w, h = cv2.boundingRect(region)
        if 8 < w < 300 and 8 < h < 100: 
            boxes.append((x, y, w, h))
    return boxes

def detect_text_regions(image):
    
    
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    gray = clahe.apply(gray)
    
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                 cv2.THRESH_BINARY, 11, 2)
    
    config = '--oem 1 --psm 3 -c tessedit_char_blacklist=§±®©°¥€¢$£¤¶◊'
    ocr_data = pytesseract.image_to_data(thresh, output_type=Output.DICT, config=config)
    
    boxes = []
    
    for i in range(len(ocr_data['text'])):
        conf = int(ocr_data['conf'][i])
        if conf > 20:  
            x, y, w, h = (ocr_data['left'][i], ocr_data['top'][i],
                         ocr_data['width'][i], ocr_data['height'][i])
            if w * h > 30: 
                boxes.append((x, y, w, h))
    
    mser_boxes = get_text_regions_mser(image)
    
   
    all_boxes = boxes + mser_boxes
    
    merged_boxes = []
    while all_boxes:
        base = all_boxes.pop(0)
        i = 0
        while i < len(all_boxes):
            current = all_boxes[i]
            if boxes_overlap(base, current):
                base = merge_boxes(base, current)
                all_boxes.pop(i)
            else:
                i += 1
        merged_boxes.append(base)
    
    return merged_boxes

def boxes_overlap(box1, box2):
    
    x1, y1, w1, h1 = box1
    x2, y2, w2, h2 = box2
    return not (x1 + w1 < x2 or x2 + w2 < x1 or 
               y1 + h1 < y2 or y2 + h2 < y1)

def merge_boxes(box1, box2):
    
    x1 = min(box1[0], box2[0])
    y1 = min(box1[1], box2[1])
    x2 = max(box1[0] + box1[2], box2[0] + box2[2])
    y2 = max(box1[1] + box1[3], box2[1] + box2[3])
    return (x1, y1, x2 - x1, y2 - y1)

def enhance_text_regions(image, boxes, enhancement_factor=1.5):
    
    result = image.copy()
    for x, y, w, h in boxes:
        
        pad = max(4, int(min(w, h) * 0.1))
        y_start = max(0, y - pad)
        y_end = min(image.shape[0], y + h + pad)
        x_start = max(0, x - pad)
        x_end = min(image.shape[1], x + w + pad)
        
        region = image[y_start:y_end, x_start:x_end]
        
       
        blurred = cv2.GaussianBlur(region, (0, 0), 1.0)
        enhanced_region = cv2.addWeighted(region, 1.5, blurred, -0.5, 0)
        
       
        lab = cv2.cvtColor(enhanced_region, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
        l = clahe.apply(l)
        enhanced_region = cv2.cvtColor(cv2.merge([l, a, b]), cv2.COLOR_LAB2RGB)
        
        mask = np.ones(region.shape[:2], dtype=np.float32)
        mask = cv2.GaussianBlur(mask, (pad*2+1, pad*2+1), pad/2)
        mask = np.clip(mask * 0.7, 0, 1) 
        mask = mask[:,:,np.newaxis]
        
        result[y_start:y_end, x_start:x_end] = \
            enhanced_region * mask + region * (1 - mask)
    
    return result


print("Upscaling image...")
output_np, _ = upsampler.enhance(image_np, outscale=4)

print("Detecting and enhancing text regions...")
text_boxes = detect_text_regions(output_np)
if text_boxes:
    output_np = enhance_text_regions(output_np, text_boxes)
    print(f"Enhanced {len(text_boxes)} text regions")
else:
    print("No text regions detected")

output_image = Image.fromarray(output_np)
output_image.save(output_path)
print(f"Upscaling complete! Output saved at: {output_path}")
