processing_status = {}
status_registry = {}

def update_status(track_name, status, current_step, stems=None, midi=None):
    """
    Update the processing status for a given track.

    Args:
        track_name (str): The name of the track being processed.
        status (str): The overall status of the processing (e.g., "Processing", "Completed", "Failed").
        current_step (str): The current step of the process.
        stems (dict, optional): The URLs of the processed stems.
        midi (dict, optional): The URLs of the generated MIDI files.
    """
    # Update the status information
    status_registry[track_name] = {
        "status": status,
        "current_step": current_step
    }

    if stems:
        status_registry[track_name]["stems"] = stems

    if midi:
        status_registry[track_name]["midi"] = midi

def get_status(track_name):
    return processing_status.get(track_name, {"status": "Not Found"})
