from inference_sdk import InferenceHTTPClient

class RoboflowClient:
    def __init__(self):
        self.client = InferenceHTTPClient(
            api_url="https://serverless.roboflow.com",
            api_key="NyScm6U7q8NSjb6mo9ZC"
        )
    
    def detect_flag(self, image_path):
        """
        Detect flag in the given image using Roboflow API
        
        Args:
            image_path: Path to the image file
            
        Returns:
            dict: Roboflow API response
        """
        return self.client.infer(image_path, model_id="flag_project-d3hjr/15")