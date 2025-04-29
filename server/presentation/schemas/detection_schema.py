def detection_log_to_dict(log):
    """Convert DetectionLog model to dictionary for JSON response"""
    return {
        'id': log.id,
        'flag_detected': log.flag_detected,
        'confidence': log.confidence,
        'ip_address': log.ip_address,
        'user_agent': log.user_agent,
        'timestamp': log.timestamp.isoformat(),
        'user_id': log.user_id
    }