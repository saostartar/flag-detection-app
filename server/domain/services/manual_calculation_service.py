import os
import cv2
import numpy as np
import math
from core.exceptions import ApiError
from infrastructure.external.roboflow_client import RoboflowClient
from sklearn.cluster import KMeans  # Add this import for color clustering

class ManualCalculationService:
    """
    Service to manually calculate flag detection steps similar to a CNN model.
    
    EDUCATIONAL PURPOSE:
    This is a simplified simulation of how deep learning models like YOLOv8 work.
    It's designed for educational purposes to illustrate the concepts behind CNN-based
    object detection but is not an actual implementation of a neural network.
    The calculations are approximations to help visualize the process.
    """
    
    def __init__(self):
        self.roboflow_client = RoboflowClient()
        # Flag metadata remains the same as before
        self.flag_metadata = {
            "indonesia": {
                "colors": ["red", "white"],
                "pattern": "2 horizontal stripes (red-white)",
                "aspect_ratio": "3:2",
                "expected_color_distribution": {"red": 0.5, "white": 0.5},
                "orientation": "horizontal",
                "line_pattern": "horizontal",
                "expected_lines": 1  # One line separating two stripes
            },
            "malaysia": {
                "colors": ["blue", "red", "white", "yellow"],
                "pattern": "14 horizontal stripes with canton",
                "aspect_ratio": "2:1",
                "expected_color_distribution": {"blue": 0.25, "red": 0.40, "white": 0.25, "yellow": 0.1},
                "orientation": "horizontal",
                "line_pattern": "horizontal",
                "expected_lines": 13  # 14 stripes means 13 lines
            },
            "singapore": {
                "colors": ["red", "white"],
                "pattern": "2 horizontal stripes with crescent and stars",
                "aspect_ratio": "3:2",
                "expected_color_distribution": {"red": 0.5, "white": 0.5},
                "orientation": "horizontal",
                "line_pattern": "horizontal",
                "expected_lines": 1
            },
            "thailand": {
                "colors": ["red", "white", "blue"],
                "pattern": "5 horizontal stripes",
                "aspect_ratio": "3:2",
                "expected_color_distribution": {"red": 0.33, "white": 0.33, "blue": 0.33},
                "orientation": "horizontal",
                "line_pattern": "horizontal", 
                "expected_lines": 4  # 5 stripes means 4 lines
            },
            "vietnam": {
                "colors": ["red", "yellow"],
                "pattern": "red with yellow star",
                "aspect_ratio": "3:2",
                "expected_color_distribution": {"red": 0.95, "yellow": 0.05},
                "orientation": "horizontal",
                "line_pattern": "none",
                "expected_lines": 0
            },
            "philippines": {
                "colors": ["blue", "red", "white", "yellow"],
                "pattern": "horizontal bicolor with triangle",
                "aspect_ratio": "1:2",
                "expected_color_distribution": {"blue": 0.5, "red": 0.5, "white": 0.1, "yellow": 0.05},
                "orientation": "horizontal",
                "line_pattern": "horizontal+diagonal",
                "expected_lines": 2  # 1 horizontal + 1 diagonal
            },
            "myanmar": {
                "colors": ["yellow", "green", "red"],
                "pattern": "3 horizontal stripes with star",
                "aspect_ratio": "3:2",
                "expected_color_distribution": {"yellow": 0.33, "green": 0.33, "red": 0.33},
                "orientation": "horizontal",
                "line_pattern": "horizontal",
                "expected_lines": 2  # 3 stripes means 2 lines
            },
            "brunei": {
                "colors": ["yellow", "white", "black"],
                "pattern": "yellow with diagonal stripes and emblem",
                "aspect_ratio": "1:2",
                "expected_color_distribution": {"yellow": 0.8, "white": 0.1, "black": 0.1},
                "orientation": "horizontal",
                "line_pattern": "diagonal",
                "expected_lines": 2  # Diagonal stripes
            },
            "cambodia": {
                "colors": ["blue", "red", "white"],
                "pattern": "horizontal tricolor with emblem",
                "aspect_ratio": "2:3",
                "expected_color_distribution": {"blue": 0.2, "red": 0.6, "white": 0.2},
                "orientation": "horizontal",
                "line_pattern": "horizontal",
                "expected_lines": 2  # 3 stripes means 2 lines
            },
            "laos": {
                "colors": ["blue", "red", "white"],
                "pattern": "horizontal tricolor with circle",
                "aspect_ratio": "2:3",
                "expected_color_distribution": {"blue": 0.25, "red": 0.5, "white": 0.25},
                "orientation": "horizontal",
                "line_pattern": "horizontal",
                "expected_lines": 2  # 3 stripes means 2 lines
            }
        }
        
        # Define HSV color thresholds for better color classification
        self.hsv_color_ranges = {
            "red": [
                {"lower": np.array([0, 100, 100]), "upper": np.array([10, 255, 255])},
                {"lower": np.array([160, 100, 100]), "upper": np.array([180, 255, 255])}  # Red wraps around in HSV
            ],
            "green": [{"lower": np.array([35, 100, 100]), "upper": np.array([85, 255, 255])}],
            "blue": [{"lower": np.array([100, 100, 100]), "upper": np.array([130, 255, 255])}],
            "yellow": [{"lower": np.array([20, 100, 100]), "upper": np.array([35, 255, 255])}],
            "white": [{"lower": np.array([0, 0, 200]), "upper": np.array([180, 30, 255])}],
            "black": [{"lower": np.array([0, 0, 0]), "upper": np.array([180, 255, 30])}]
        }
    
    def process_flag_image(self, image_file_storage):
        """Process the image and return manual calculation steps"""
        # Save temporary file
        standardized_image_path = "temp_standardized_for_processing.jpg"
        
        try:
            # 1. Read file image from FileStorage to memory as NumPy array
            image_bytes = image_file_storage.read()
            nparr = np.frombuffer(image_bytes, np.uint8)
            
            # 2. Decode NumPy array to OpenCV image (BGR by default)
            img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img_bgr is None:
                raise ApiError("Failed to decode image. The file might be corrupted or not a valid image format.")

            # 3. (Optional but recommended) Ensure the image is a 3-channel BGR
            if len(img_bgr.shape) == 2:  # Grayscale
                img_bgr = cv2.cvtColor(img_bgr, cv2.COLOR_GRAY2BGR)
            elif img_bgr.shape[2] == 4:  # BGRA (with alpha channel)
                img_bgr = cv2.cvtColor(img_bgr, cv2.COLOR_BGRA2BGR)
            
            # 4. Save the standardized image for sending to Roboflow
            # and as the basis for manual calculation
            cv2.imwrite(standardized_image_path, img_bgr)
            
            # 5. Get model prediction using the standardized image
            model_results = self.roboflow_client.detect_flag(standardized_image_path)
            
            # 6. For manual calculation, resize the in-memory image
            # This is more efficient than rereading from disk
            image_resized_for_manual = cv2.resize(img_bgr, (640, 640))
            
            # 7. Calculate the manual steps
            calculation_steps = self._calculate_steps(image_resized_for_manual, model_results)
            
            # 8. Add educational explanation to make simulation purpose clear
            calculation_steps["educational_note"] = {
                "title": "Educational Simulation Note",
                "description": "This is a simplified educational simulation of how CNN-based models like YOLOv8 work. " +
                              "It doesn't represent an actual neural network implementation but rather illustrates the " +
                              "concepts behind object detection for learning purposes. The actual CNN process is more " +
                              "complex and involves millions of parameters trained on large datasets."
            }
            
            return {
                "model_prediction": model_results,
                "manual_calculation": calculation_steps
            }
            
        except Exception as e:
            # Ensure good error logging here
            # import logging
            # logging.exception("Error in process_flag_image")
            raise e  # Re-throw error to be caught at higher level
        finally:
            # Clean up
            if os.path.exists(standardized_image_path):
                os.remove(standardized_image_path)
    
    def _calculate_steps(self, image, model_results):
        """Calculate all manual calculation steps"""
        # Extract the top prediction if available
        top_prediction = None
        predicted_class = "unknown"
        if "predictions" in model_results and len(model_results["predictions"]) > 0:
            top_prediction = max(model_results["predictions"], key=lambda x: x.get("confidence", 0))
            predicted_class = top_prediction.get("class", "unknown").lower()
        
        # 1. Input Image Analysis - Sample key pixels
        input_analysis = self._analyze_input_pixels(image)
        
        # 2. Color Analysis - Now with improved HSV-based analysis
        color_analysis = self._analyze_colors(image, predicted_class)
        
        # 3. Convolution Simulation
        convolution = self._simulate_convolution(image)
        
        # 4. Feature Maps and Pooling
        feature_maps = self._simulate_feature_maps(convolution)
        
        # 5. Bounding Box Calculation
        bounding_box = self._calculate_bounding_box(image, top_prediction)
        
        # 6. Class Probability
        class_probs = self._calculate_class_probabilities(color_analysis, predicted_class)
        
        # 7. Pattern Matching - Now with Hough line detection
        pattern_matching = self._pattern_matching(image, color_analysis, predicted_class)
        
        # 8. Shape Analysis - Now with contour analysis
        shape_analysis = self._analyze_shape(image, top_prediction, predicted_class)
        
        # 9. NMS (using model results)
        nms_results = self._simulate_nms(model_results)
        
        # 10. Final Confidence Calculation
        final_confidence = self._calculate_final_confidence(
            bounding_box.get("objectness", 0), 
            class_probs.get("probabilities", {}).get(predicted_class, 0),
            pattern_matching.get("pattern_score", 0),
            shape_analysis.get("shape_score", 0)
        )
        
        return {
            "input_analysis": input_analysis,
            "color_analysis": color_analysis,
            "convolution": convolution,
            "feature_maps": feature_maps,
            "bounding_box": bounding_box,
            "class_probabilities": class_probs,
            "pattern_matching": pattern_matching,
            "shape_analysis": shape_analysis,
            "nms": nms_results,
            "final_confidence": final_confidence
        }
    
    def _analyze_input_pixels(self, image):
        """Analyze a sample of key pixels in the image"""
        # Sample pixels at different positions (simplified)
        height, width = image.shape[:2]
        sample_points = [
            (0, 0),              # Top-left
            (width//2, 0),       # Top-middle
            (width-1, 0),        # Top-right
            (0, height//2),      # Middle-left
            (width//2, height//2), # Center
            (width-1, height//2), # Middle-right
            (0, height-1),       # Bottom-left
            (width//2, height-1), # Bottom-middle
            (width-1, height-1)  # Bottom-right
        ]
        
        # Convert image to HSV for better color analysis
        image_hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        pixel_samples = []
        for x, y in sample_points:
            bgr = image[y, x]
            hsv = image_hsv[y, x]
            
            # Convert BGR to RGB
            r, g, b = int(bgr[2]), int(bgr[1]), int(bgr[0])
            h, s, v = int(hsv[0]), int(hsv[1]), int(hsv[2])
            
            # Determine color type using HSV
            color_type = self._classify_color_hsv(hsv)
            
            pixel_samples.append({
                "position": f"({x},{y})",
                "r": r, "g": g, "b": b,
                "h": h, "s": s, "v": v,
                "r_normalized": round(r/255, 2),
                "color_type": color_type
            })
        
        return {
            "image_dimensions": f"{width}x{height}",
            "pixel_samples": pixel_samples,
            "color_space": "RGB and HSV analyzed"
        }
    
    def _analyze_colors(self, image, predicted_class):
        """
        Analyze color distribution using HSV color space and k-means clustering
        for more robust color identification
        """
        # Convert to HSV for better color analysis
        image_hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Count pixel colors using HSV thresholds
        height, width = image_hsv.shape[:2]
        total_pixels = height * width
        
        # Sample pixels for better performance
        sample_ratio = 0.1  # Sample 10% of pixels
        sample_count = int(total_pixels * sample_ratio)
        step = max(1, total_pixels // sample_count)
        
        # Initialize color counts
        color_counts = {
            "red": 0, "green": 0, "blue": 0,
            "white": 0, "yellow": 0, "black": 0,
            "other": 0
        }
        
        # Sample for HSV-based classification
        hsv_samples = []
        for i in range(0, height * width, step):
            y, x = i // width, i % width
            hsv = image_hsv[y, x]
            hsv_samples.append(hsv)
            
            color = self._classify_color_hsv(hsv)
            if color in color_counts:
                color_counts[color] += 1
            else:
                color_counts["other"] += 1
        
        # Color clustering for dominant colors
        hsv_samples_array = np.array(hsv_samples)
        
        # Determine optimal cluster count based on expected colors in the flag
        if predicted_class in self.flag_metadata:
            expected_colors = self.flag_metadata[predicted_class].get("colors", [])
            n_clusters = min(len(expected_colors) + 1, 5)  # Cap at 5 clusters
        else:
            n_clusters = 3  # Default cluster count
        
        # Apply k-means clustering to find dominant colors
        if len(hsv_samples_array) > n_clusters:  # Ensure we have enough samples
            kmeans = KMeans(n_clusters=n_clusters, random_state=42)
            kmeans.fit(hsv_samples_array)
            cluster_centers = kmeans.cluster_centers_
            
            # Convert cluster centers back to BGR
            dominant_colors_hsv = cluster_centers.astype(np.uint8)
            dominant_colors_bgr = []
            for hsv_color in dominant_colors_hsv:
                # Convert 1-pixel HSV to BGR
                bgr = cv2.cvtColor(hsv_color.reshape(1, 1, 3), cv2.COLOR_HSV2BGR)
                dominant_colors_bgr.append(bgr[0, 0].tolist())
            
            # Get cluster sizes
            cluster_labels = kmeans.labels_
            cluster_sizes = np.bincount(cluster_labels)
            cluster_percentages = cluster_sizes / len(cluster_labels)
            
            dominant_color_info = []
            for i, (bgr_color, hsv_color, percentage) in enumerate(zip(dominant_colors_bgr, dominant_colors_hsv, cluster_percentages)):
                b, g, r = bgr_color
                h, s, v = hsv_color.tolist()
                
                # Classify color
                color_name = self._classify_color_hsv(hsv_color)
                
                dominant_color_info.append({
                    "cluster_id": i + 1,
                    "color_name": color_name,
                    "percentage": round(percentage * 100, 2),
                    "rgb": [int(r), int(g), int(b)],
                    "hsv": [int(h), int(s), int(v)]
                })
        else:
            dominant_color_info = []
        
        total_sampled = sum(color_counts.values())
        color_percentages = {color: count/total_sampled for color, count in color_counts.items()}
        
        # Get expected color distribution for this flag if available
        expected_distribution = {}
        if predicted_class in self.flag_metadata:
            expected_distribution = self.flag_metadata[predicted_class].get("expected_color_distribution", {})
        
        return {
            "total_pixels": total_pixels,
            "sampled_pixels": total_sampled,
            "color_counts": color_counts,
            "color_percentages": {k: round(v * 100, 2) for k, v in color_percentages.items()},
            "expected_distribution": {k: round(v * 100, 2) for k, v in expected_distribution.items()} if expected_distribution else {},
            "dominant_colors": dominant_color_info,
            "color_analysis_method": "HSV thresholding with k-means clustering"
        }
    
    def _classify_color_hsv(self, hsv):
        """Classify a pixel into a color category using HSV thresholds"""
        h, s, v = hsv
        
        # Check for white and black first based on value and saturation
        if v < 30:
            return "black"
        if s < 30 and v > 200:
            return "white"
            
        # Check for specific colors using HSV ranges
        for color, ranges in self.hsv_color_ranges.items():
            for range_dict in ranges:
                lower = range_dict["lower"]
                upper = range_dict["upper"]
                
                # Check if the HSV value is within the range
                if (lower[0] <= h <= upper[0] and 
                    lower[1] <= s <= upper[1] and 
                    lower[2] <= v <= upper[2]):
                    return color
        
        return "other"
    
    def _simulate_convolution(self, image):
        """Simulate the first convolution layer"""
        # Convert to grayscale for edge detection
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Define kernels for edge detection
        horizontal_edge_kernel = np.array([[-1, -1, -1], 
                                           [0, 0, 0], 
                                           [1, 1, 1]])
        
        vertical_edge_kernel = np.array([[-1, 0, 1], 
                                         [-1, 0, 1], 
                                         [-1, 0, 1]])
        
        # Apply convolution
        horizontal_edges = cv2.filter2D(gray, -1, horizontal_edge_kernel)
        vertical_edges = cv2.filter2D(gray, -1, vertical_edge_kernel)
        
        # Add combined edges visualization
        combined_edges = cv2.addWeighted(horizontal_edges, 0.5, vertical_edges, 0.5, 0)
        _, thresholded_edges = cv2.threshold(combined_edges, 50, 255, cv2.THRESH_BINARY)
        
        # Sample convolution outputs at key points
        sample_points = [(10, 10), (320, 10), (10, 320), (320, 320)]
        
        sample_results = []
        for x, y in sample_points:
            region = f"({x}:{x+2},{y}:{y+2})"
            pixel_region = gray[y:y+3, x:x+3].tolist() if 0 <= y < gray.shape[0]-3 and 0 <= x < gray.shape[1]-3 else []
            h_output = horizontal_edges[y, x] if 0 <= y < horizontal_edges.shape[0] and 0 <= x < horizontal_edges.shape[1] else 0
            v_output = vertical_edges[y, x] if 0 <= y < vertical_edges.shape[0] and 0 <= x < vertical_edges.shape[1] else 0
            
            sample_results.append({
                "region": region,
                "pixel_values": pixel_region,
                "horizontal_kernel": horizontal_edge_kernel.tolist(),
                "vertical_kernel": vertical_edge_kernel.tolist(),
                "horizontal_output": int(h_output),
                "vertical_output": int(v_output)
            })
        
        # Calculate edge statistics
        edge_stats = {
            "horizontal_edge_mean": float(np.mean(horizontal_edges)),
            "vertical_edge_mean": float(np.mean(vertical_edges)),
            "horizontal_edge_std": float(np.std(horizontal_edges)),
            "vertical_edge_std": float(np.std(vertical_edges))
        }
        
        return {
            "kernels": {
                "horizontal_edge": horizontal_edge_kernel.tolist(),
                "vertical_edge": vertical_edge_kernel.tolist()
            },
            "sample_results": sample_results,
            "edge_statistics": edge_stats,
            "explanation": "Convolution detects features like edges by applying filter kernels to the image. " +
                           "In a real CNN, hundreds of learned filters detect complex patterns."
        }
    
    def _simulate_feature_maps(self, convolution_results):
        """Simulate feature maps and pooling operations"""
        # This is a simplified simulation
        
        # Create mock feature maps based on convolution results
        feature_map_examples = [
            {"position": "top_left", "x": 1, "y": 1, "values": [2, 3, 2, 1]},
            {"position": "top_right", "x": 40, "y": 1, "values": [1, 2, 0, 1]},
            {"position": "bottom_left", "x": 1, "y": 40, "values": [1, 0, 1, 0]},
            {"position": "bottom_right", "x": 40, "y": 40, "values": [3, 2, 1, 3]},
            {"position": "center", "x": 20, "y": 20, "values": [4, 3, 5, 4]}
        ]
        
        # Simulate max pooling and average pooling for comparison
        pooling_results = []
        for feature in feature_map_examples:
            max_value = max(feature["values"])
            avg_value = sum(feature["values"]) / len(feature["values"])
            
            pooling_results.append({
                "region": f"({feature['x']}:{feature['x']+2},{feature['y']}:{feature['y']+2})",
                "feature_values": feature["values"],
                "max_value": max_value,
                "avg_value": round(avg_value, 2),
                "feature_map_x": feature["x"],
                "feature_map_y": feature["y"]
            })
        
        return {
            "feature_map_dimensions": "13x13 (downsampled from 640x640)",
            "pooling_results": pooling_results,
            "pooling_types": ["max", "average"],
            "explanation": "Feature maps capture patterns like edges, textures, and color transitions. " +
                          "In a real CNN, early layers detect simple features while deeper layers detect " +
                          "more complex patterns. Pooling reduces dimensionality while preserving important features."
        }
    
    def _calculate_bounding_box(self, image, prediction):
        """Calculate bounding box information based on model prediction"""
        height, width = image.shape[:2]
        
        if prediction is None:
            # Generate a default bounding box if no prediction available
            x_center = width / 2
            y_center = height / 2
            bbox_width = width * 0.7
            bbox_height = height * 0.5
            confidence = 0.5
        else:
            # Extract from prediction
            x_center = prediction.get("x", width/2)
            y_center = prediction.get("y", height/2)
            bbox_width = prediction.get("width", width*0.7)
            bbox_height = prediction.get("height", height*0.5)
            confidence = prediction.get("confidence", 0.5)
        
        # Calculate grid cell coordinates (assuming 13x13 grid)
        grid_size_x = width / 13
        grid_size_y = height / 13
        grid_cell_x = int(x_center / grid_size_x)
        grid_cell_y = int(y_center / grid_size_y)
        
        # Calculate relative positions within grid cell
        x_rel = (x_center % grid_size_x) / grid_size_x
        y_rel = (y_center % grid_size_y) / grid_size_y
        
        # Calculate relative width and height
        width_rel = bbox_width / width
        height_rel = bbox_height / height
        
        # Calculate anchor box IoU (simplified)
        # In YOLOv8, anchor boxes are learned during training
        anchor_examples = [(1.0, 1.0), (0.8, 1.2), (1.2, 0.8)]
        best_anchor = 0
        best_iou = 0
        
        for i, (aw, ah) in enumerate(anchor_examples):
            # Calculate IoU between predicted box and anchor
            anchor_width = aw * grid_size_x
            anchor_height = ah * grid_size_y
            
            # Calculate intersection area (simplified)
            inter_width = min(bbox_width, anchor_width)
            inter_height = min(bbox_height, anchor_height)
            intersection = inter_width * inter_height if inter_width > 0 and inter_height > 0 else 0
            
            # Calculate union area
            union = bbox_width * bbox_height + anchor_width * anchor_height - intersection
            
            # Calculate IoU
            iou = intersection / union if union > 0 else 0
            
            if iou > best_iou:
                best_iou = iou
                best_anchor = i
        
        return {
            "grid_cell": (grid_cell_x, grid_cell_y),
            "x_center": round(x_rel, 2),
            "y_center": round(y_rel, 2),
            "width": round(width_rel, 2),
            "height": round(height_rel, 2),
            "objectness": round(confidence, 2),
            "best_anchor": best_anchor,
            "anchor_iou": round(best_iou, 2),
            "explanation": "Grid cell: Location in 13x13 feature map. (x,y)_center: Position relative to grid cell. " +
                          "width/height: Size relative to image. YOLOv8 predicts bounding boxes by learning " +
                          "offsets from anchor boxes in each grid cell."
        }
    
    def _calculate_class_probabilities(self, color_analysis, predicted_class):
        """Calculate probabilities for each flag class based on color analysis"""
        # Get dominant colors from improved color analysis
        color_percentages = color_analysis.get("color_percentages", {})
        dominant_colors = color_analysis.get("dominant_colors", [])
        
        # Calculate class probabilities based on color match with known flags
        class_probs = {}
        notes = {}
        
        for flag_class, metadata in self.flag_metadata.items():
            expected_colors = metadata.get("colors", [])
            expected_distribution = metadata.get("expected_color_distribution", {})
            
            # Calculate color match score using both pixel classification and dominant colors
            color_match_score = 0
            total_expected = 0
            
            # Method 1: Compare with expected color distribution
            for color, expected_pct in expected_distribution.items():
                actual_pct = color_percentages.get(color, 0) / 100  # Convert from percentage to proportion
                match_quality = 1 - min(1, abs(expected_pct - actual_pct) / max(expected_pct, 0.01))
                color_match_score += match_quality * expected_pct
                total_expected += expected_pct
            
            # Normalize score
            if total_expected > 0:
                color_match_score = color_match_score / total_expected
                
            # Method 2: Check if dominant colors match expected colors
            dominant_color_match = 0
            if dominant_colors:
                expected_color_count = len(expected_colors)
                matched_colors = 0
                
                for color_info in dominant_colors:
                    if color_info["color_name"] in expected_colors:
                        matched_colors += 1
                
                if expected_color_count > 0:
                    dominant_color_match = matched_colors / expected_color_count
            
            # Combine both methods (weighted average)
            final_match_score = 0.7 * color_match_score + 0.3 * dominant_color_match
            
            # Convert to probability (capped)
            probability = min(0.95, max(0.05, final_match_score))
            
            # Add to results
            class_probs[flag_class] = round(probability, 2)
            
            # Add explanation for the predicted class
            if flag_class == predicted_class:
                notes[flag_class] = "Highest match based on color distribution"
            elif probability > 0.7:
                notes[flag_class] = "Very similar color profile"
            elif probability > 0.5:
                notes[flag_class] = "Similar color profile"
            elif probability > 0.3:
                notes[flag_class] = "Some color similarities"
            else:
                notes[flag_class] = "Low color match"
        
        # Sort by probability
        sorted_probs = sorted(class_probs.items(), key=lambda x: x[1], reverse=True)
        
        return {
            "probabilities": class_probs,
            "sorted_probabilities": sorted_probs,
            "notes": notes,
            "explanation": "Probabilities are calculated based on color distribution match with known flags. " +
                          "Both HSV color classification and dominant color clustering are used to improve accuracy."
        }
    
    def _pattern_matching(self, image, color_analysis, predicted_class):
        """
        Evaluate how well the image matches expected flag patterns 
        using Hough line detection for stripe patterns
        """
        # 1. Prepare image for line detection
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        
        # 2. Apply Hough Line Transform
        lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=100, minLineLength=100, maxLineGap=10)
        
        # Initialize pattern analysis results
        horizontal_lines = 0
        vertical_lines = 0
        diagonal_lines = 0
        
        if lines is not None:
            for line in lines:
                x1, y1, x2, y2 = line[0]
                
                # Calculate line angle
                angle = abs(math.degrees(math.atan2(y2 - y1, x2 - x1)))
                
                # Classify line orientation
                if angle < 10 or angle > 170:  # Nearly horizontal
                    horizontal_lines += 1
                elif 80 < angle < 100:  # Nearly vertical
                    vertical_lines += 1
                else:  # Diagonal
                    diagonal_lines += 1
        
        # Get expected pattern from metadata
        if predicted_class not in self.flag_metadata:
            expected_pattern = "unknown"
            expected_line_pattern = "unknown"
            expected_lines = 0
        else:
            flag_data = self.flag_metadata[predicted_class]
            expected_pattern = flag_data.get("pattern", "unknown")
            expected_line_pattern = flag_data.get("line_pattern", "unknown")
            expected_lines = flag_data.get("expected_lines", 0)
        
        # Calculate color distribution score
        color_pcts = color_analysis.get("color_percentages", {})
        expected_dist = {}
        if predicted_class in self.flag_metadata:
            expected_dist = self.flag_metadata[predicted_class].get("expected_color_distribution", {})
        
        color_distribution_score = 0
        for color, expected in expected_dist.items():
            actual = color_pcts.get(color, 0) / 100  # Convert percentage to proportion
            similarity = 1 - min(1, abs(expected - actual) / max(expected, 0.01))
            color_distribution_score += similarity * expected
        
        # Normalize
        total_expected = sum(expected_dist.values()) if expected_dist else 1
        color_distribution_score = color_distribution_score / total_expected
        
        # Calculate line pattern match score
        line_pattern_score = 0
        if expected_line_pattern == "horizontal":
            # Calculate how close horizontal line count is to expected
            line_count_match = 1 - min(1, abs(horizontal_lines - expected_lines) / max(1, expected_lines))
            # Penalize for unexpected vertical lines
            vertical_penalty = max(0, 1 - (vertical_lines / max(1, horizontal_lines)) * 0.5)
            line_pattern_score = line_count_match * vertical_penalty
        elif expected_line_pattern == "vertical":
            line_count_match = 1 - min(1, abs(vertical_lines - expected_lines) / max(1, expected_lines))
            horizontal_penalty = max(0, 1 - (horizontal_lines / max(1, vertical_lines)) * 0.5)
            line_pattern_score = line_count_match * horizontal_penalty
        elif expected_line_pattern == "diagonal":
            line_count_match = 1 - min(1, abs(diagonal_lines - expected_lines) / max(1, expected_lines))
            line_pattern_score = line_count_match
        elif expected_line_pattern == "horizontal+diagonal":
            h_match = 1 - min(1, abs(horizontal_lines - 1) / 1)  # Expect 1 horizontal
            d_match = 1 - min(1, abs(diagonal_lines - 1) / 1)    # Expect 1 diagonal
            line_pattern_score = (h_match + d_match) / 2
        elif expected_line_pattern == "none":  # No specific line pattern expected
            line_pattern_score = 0.8  # Default score when no lines expected
        else:
            line_pattern_score = 0.5  # Unknown pattern, neutral score
        
        # Other pattern factors
        aspect_ratio_score = 0.95  # Assuming aspect ratio is close to expected
        orientation_score = 1.0    # Assuming orientation matches
        
        # Calculate overall pattern score with various components
        pattern_scores = {
            "color_distribution": round(color_distribution_score, 2),
            "line_pattern_match": round(line_pattern_score, 2),
            "aspect_ratio": aspect_ratio_score,
            "orientation": orientation_score
        }
        
        # Weight the components for final score
        overall_score = (color_distribution_score * 0.4 + 
                         line_pattern_score * 0.4 + 
                         aspect_ratio_score * 0.1 + 
                         orientation_score * 0.1)
        
        # Line detection results for educational purposes
        line_detection = {
            "total_lines_detected": 0 if lines is None else len(lines),
            "horizontal_lines": horizontal_lines,
            "vertical_lines": vertical_lines,
            "diagonal_lines": diagonal_lines,
            "expected_pattern": expected_line_pattern,
            "expected_line_count": expected_lines
        }
        
        return {
            "expected_pattern": expected_pattern,
            "line_detection": line_detection,
            "component_scores": pattern_scores,
            "pattern_score": round(overall_score, 2),
            "explanation": f"Pattern score evaluates how well the image matches the expected pattern for {predicted_class} flag using Hough line detection for identifying stripes and geometric patterns."
        }
    
    def _analyze_shape(self, image, prediction, predicted_class):
        """
        Analyze shape characteristics of the detected flag using contour analysis
        """
        # Extract bounding box for region of interest
        height, width = image.shape[:2]
        
        if prediction is None:
            # Use default values if no prediction
            x_center = width // 2
            y_center = height // 2
            w = int(width * 0.7)
            h = int(height * 0.5)
        else:
            # Extract from prediction
            x_center = int(prediction.get("x", width/2))
            y_center = int(prediction.get("y", height/2))
            w = int(prediction.get("width", width*0.7))
            h = int(prediction.get("height", height*0.5))
        
        # Calculate ROI coordinates
        x1 = max(0, int(x_center - w/2))
        y1 = max(0, int(y_center - h/2))
        x2 = min(width, int(x_center + w/2))
        y2 = min(height, int(y_center + h/2))
        
        # Extract ROI
        roi = image[y1:y2, x1:x2]
        if roi.size == 0:  # Check if ROI is valid
            roi = image  # Use full image if ROI is invalid
        
        # Convert to grayscale and threshold for contour detection
        gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray_roi, 127, 255, cv2.THRESH_BINARY)
        
        # Find contours
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Analyze contours
        contour_features = {
            "contour_count": len(contours),
            "largest_contour_area": 0,
            "rectangularity": 0,
            "solidity": 0
        }
        
        if contours:
            # Find largest contour by area
            areas = [cv2.contourArea(c) for c in contours]
            largest_idx = np.argmax(areas)
            largest_contour = contours[largest_idx]
            largest_area = areas[largest_idx]
            
            # Calculate rectangularity (how rectangular the shape is)
            x, y, w, h = cv2.boundingRect(largest_contour)
            rect_area = w * h
            rectangularity = largest_area / rect_area if rect_area > 0 else 0
            
            # Calculate solidity (area ratio to convex hull)
            hull = cv2.convexHull(largest_contour)
            hull_area = cv2.contourArea(hull)
            solidity = largest_area / hull_area if hull_area > 0 else 0
            
            contour_features = {
                "contour_count": len(contours),
                "largest_contour_area": float(largest_area),
                "rectangularity": float(rectangularity),
                "solidity": float(solidity)
            }
        
        # Shape measurements
        actual_aspect_ratio = w / h if h > 0 else 1
        expected_aspect_ratio = 1.5  # Default 3:2 for most flags
        
        # Get expected aspect ratio from metadata
        if predicted_class in self.flag_metadata:
            ratio_str = self.flag_metadata[predicted_class].get("aspect_ratio", "3:2")
            if ":" in ratio_str:
                w_ratio, h_ratio = map(int, ratio_str.split(":"))
                expected_aspect_ratio = w_ratio / h_ratio if h_ratio > 0 else 1.5
        
        # Compare aspect ratios
        aspect_ratio_score = 1 - min(1, abs(actual_aspect_ratio - expected_aspect_ratio) / max(expected_aspect_ratio, 0.5))
        
        # Calculate rectangularity score (most flags are rectangular)
        rectangularity_score = contour_features["rectangularity"]
        
        # Calculate symmetry - simplified approximation
        # For more accurate symmetry, we'd need to analyze pixel distributions
        symmetry_score = 0.9  # Default assumption for flags
        
        # Edge sharpness using Canny edge detection
        edges = cv2.Canny(gray_roi, 100, 200)
        edge_density = np.count_nonzero(edges) / edges.size
        edge_sharpness = min(1.0, edge_density * 10)  # Normalize
        
        shape_features = {
            "rectangularity": round(rectangularity_score, 2),
            "aspect_ratio": round(aspect_ratio_score, 2),
            "symmetry": round(symmetry_score, 2),
            "edge_sharpness": round(edge_sharpness, 2)
        }
        
        # Overall shape score as weighted average
        overall_score = (rectangularity_score * 0.3 +
                         aspect_ratio_score * 0.4 +
                         symmetry_score * 0.2 +
                         edge_sharpness * 0.1)
        
        return {
            "contour_analysis": contour_features,
            "actual_aspect_ratio": round(actual_aspect_ratio, 2),
            "expected_aspect_ratio": expected_aspect_ratio,
            "shape_features": shape_features,
            "shape_score": round(overall_score, 2),
            "explanation": "Shape analysis evaluates geometric properties of the detected flag using contour analysis, aspect ratio comparison, and edge detection."
        }
    
    def _simulate_nms(self, model_results):
        """Simulate Non-Maximum Suppression process"""
        # Extract predictions
        predictions = model_results.get("predictions", [])
        if not predictions:
            return {
                "boxes": [],
                "explanation": "No predictions to apply NMS"
            }
        
        # Sort by confidence
        sorted_preds = sorted(predictions, key=lambda x: x.get("confidence", 0), reverse=True)
        
        # Process boxes
        nms_results = []
        kept_boxes = []
        threshold = 0.45  # IoU threshold for NMS
        
        for i, pred in enumerate(sorted_preds):
            pred_id = i + 1
            confidence = pred.get("confidence", 0)
            
            # Calculate IoU with kept boxes
            max_iou = 0
            overlapping_with = None
            
            for j, kept_box in enumerate(kept_boxes):
                iou = self._calculate_iou(pred, kept_box)
                if iou > max_iou:
                    max_iou = iou
                    overlapping_with = j + 1
            
            # Decide whether to keep the box
            keep = True
            if max_iou > threshold:
                keep = False
            
            if keep:
                kept_boxes.append(pred)
            
            nms_results.append({
                "box_id": pred_id,
                "confidence": round(confidence, 2),
                "iou_with_previous": round(max_iou, 2) if overlapping_with else "-",
                "overlapping_with": overlapping_with,
                "threshold": threshold,
                "keep": keep
            })
        
        return {
            "threshold": threshold,
            "boxes": nms_results,
            "kept_boxes": len(kept_boxes),
            "explanation": "Non-Maximum Suppression removes overlapping boxes, keeping only the highest confidence detections. " +
                           "In object detection, NMS prevents duplicate detections of the same object."
        }
    
    def _calculate_iou(self, box1, box2):
        """Calculate Intersection over Union between two boxes"""
        # Extract coordinates
        x1_1 = box1.get("x", 0) - box1.get("width", 0) / 2
        y1_1 = box1.get("y", 0) - box1.get("height", 0) / 2
        x2_1 = box1.get("x", 0) + box1.get("width", 0) / 2
        y2_1 = box1.get("y", 0) + box1.get("height", 0) / 2
        
        x1_2 = box2.get("x", 0) - box2.get("width", 0) / 2
        y1_2 = box2.get("y", 0) - box2.get("height", 0) / 2
        x2_2 = box2.get("x", 0) + box2.get("width", 0) / 2
        y2_2 = box2.get("y", 0) + box2.get("height", 0) / 2
        
        # Calculate intersection area
        x1_i = max(x1_1, x1_2)
        y1_i = max(y1_1, y1_2)
        x2_i = min(x2_1, x2_2)
        y2_i = min(y2_1, y2_2)
        
        if x2_i < x1_i or y2_i < y1_i:
            return 0.0  # No intersection
        
        intersection = (x2_i - x1_i) * (y2_i - y1_i)
        
        # Calculate box areas
        area1 = (x2_1 - x1_1) * (y2_1 - y1_1)
        area2 = (x2_2 - x1_2) * (y2_2 - y1_2)
        
        # Calculate IoU
        union = area1 + area2 - intersection
        if union <= 0:
            return 0.0
            
        return intersection / union
    
    def _calculate_final_confidence(self, objectness, class_prob, pattern_score, shape_score):
        """Calculate final confidence score using component scores"""
        # Weighted combination of scores
        if objectness <= 0 or class_prob <= 0:
            return {
                "confidence": 0.0,
                "explanation": "Invalid objectness or class probability"
            }
        
        # Calculate weighted geometric mean (to ensure one low score affects the result)
        weights = [0.3, 0.3, 0.2, 0.2]  # Weights for objectness, class_prob, pattern_score, shape_score
        scores = [objectness, class_prob, pattern_score, shape_score]
        
        # Calculate weighted geometric mean
        weighted_product = 1.0
        total_weight = sum(weights)
        
        for score, weight in zip(scores, weights):
            weighted_product *= score ** (weight / total_weight)
        
        final_confidence = round(weighted_product, 4)
        
        # Create component table
        components = [
            {"component": "Objectness Score", "value": round(objectness, 2), "weight": weights[0], "explanation": "Confidence from bounding box detection"},
            {"component": "Class Probability", "value": round(class_prob, 2), "weight": weights[1], "explanation": "Probability of the detected flag class"},
            {"component": "Pattern Score", "value": round(pattern_score, 2), "weight": weights[2], "explanation": "Score for pattern matching"},
            {"component": "Shape Score", "value": round(shape_score, 2), "weight": weights[3], "explanation": "Score for shape characteristics"},
        ]
        
        return {
            "component_scores": components,
            "confidence": final_confidence,
            "confidence_pct": f"{round(final_confidence * 100, 2)}%",
            "explanation": "Final confidence is calculated using a weighted geometric mean of all component scores, " +
                           "similar to how neural networks combine feature confidences but in a much simplified form."
        }