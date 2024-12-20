// Your modal component to be shown in the popup
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

function PopupComponent({
  subjectWiseCount,
  topicWiseCount,
  openModal,
  setOpenModal,
}) {
  return (
    <Dialog
      open={openModal}
      onClose={() => setOpenModal(false)}
      maxWidth={false}
      sx={{
        "& .MuiDialog-paper": {
          width: "1000px", // Set the width to your desired value
          height: "600px", // Set the height to your desired value
        },
      }}
    >
      <DialogTitle>Quiz Summary</DialogTitle>
      <DialogContent>
        <div>
          <h6>Summary of Selected Questions</h6>
          <p>
            {JSON.stringify(subjectWiseCount)}
            {JSON.stringify(topicWiseCount)}
          </p>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenModal(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PopupComponent;
