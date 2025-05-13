import os
import json
from datetime import datetime

class ModelInfoService:
    """Service to provide information about the flag detection model"""
    
    @staticmethod
    def get_model_metadata():
        """Get metadata about the trained model"""
        return {
            "model_name": "flag_project-d3hjr",
            "version": "15",
            "architecture": "YOLOv8n",
            "trained_on": "43658 images",
            "precision": "79.6%",
            "recall": "80.9%",
            "mAP50": "85.3%",
            "training_date": "2024-04-15",
            "input_size": "640x640",
            "classes": ["Brunei", "Cambodia", "Indonesia", "Laos", "Malaysia", 
                      "Myanmar", "Philippines", "Singapore", "Thailand", "Vietnam"],
            "framework": "PyTorch",
            "description": "Custom YOLOv8 model trained to detect and classify ASEAN country flags"
        }
    
    @staticmethod
    def get_training_metrics():
        """Get detailed training metrics"""
        return {
            "epochs": 100,
            "batch_size": 16,
            "optimizer": "Adam",
            "initial_learning_rate": 0.001,
            "final_learning_rate": 0.00001,
            "precision_by_class": {
                "Brunei": 0.78,
                "Cambodia": 0.81,
                "Indonesia": 0.85,
                "Laos": 0.76,
                "Malaysia": 0.77,
                "Myanmar": 0.79,
                "Philippines": 0.82,
                "Singapore": 0.88,
                "Thailand": 0.81,
                "Vietnam": 0.78
            },
            "recall_by_class": {
                "Brunei": 0.79,
                "Cambodia": 0.82,
                "Indonesia": 0.87,
                "Laos": 0.78,
                "Malaysia": 0.81,
                "Myanmar": 0.77,
                "Philippines": 0.81,
                "Singapore": 0.89,
                "Thailand": 0.82,
                "Vietnam": 0.79
            },
            "f1_by_class": {
                "Brunei": 0.78,
                "Cambodia": 0.81,
                "Indonesia": 0.86,
                "Laos": 0.77,
                "Malaysia": 0.79,
                "Myanmar": 0.78,
                "Philippines": 0.81,
                "Singapore": 0.88,
                "Thailand": 0.81,
                "Vietnam": 0.78
            },
            "confusion_matrix": "confusion_matrix_data.json",
            "augmentations_used": [
                "Random rotation (±15°)",
                "Random brightness (±20%)",
                "Random contrast (±20%)",
                "Random horizontal flip",
                "Random shear (±10°)"
            ],
            "training_hardware": "NVIDIA A100 GPU",
            "training_time_hours": 8.5
        }