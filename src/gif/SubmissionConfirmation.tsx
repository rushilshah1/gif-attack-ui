import React, { useState } from 'react'

//UI + CSS
import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';

export const SubmissionConfirmation: React.FC = () => {
    const [open, setOpen] = useState<boolean>(true);
    const handleClose = () => setOpen(false);
    return (
        <Snackbar open={open} autoHideDuration={2500} onClose={handleClose}>
            <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="success">
                Your gif has been successfully submitted!
        </MuiAlert>
        </Snackbar>

    )
}
