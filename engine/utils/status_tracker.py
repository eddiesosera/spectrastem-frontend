processing_status = {}

def update_status(track_name, status, current_stem=None, stems=None):
    processing_status[track_name] = {
        "status": status,
        "current_stem": current_stem,
        "stems": stems
    }

def get_status(track_name):
    return processing_status.get(track_name, {"status": "Not Found"})
