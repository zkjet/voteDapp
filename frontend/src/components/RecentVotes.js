import axios from "axios";
import React from "react";
import { Button } from "react-bootstrap";

import { API_BASE_URL } from "../config/URLs";

export default function RequestToken({ signer }) {
    const [errorMessage, setErrorMessage] = React.useState(null);

    function handleSubmit() {
        if (!signer) {
            setErrorMessage("Error: Signer not available");
            return;
        }

        axios({
            method: "GET",
            url: `${API_BASE_URL}ballot/votes`,
            headers: { "Content-Type": "application/json" },
        })
        .then((resp) => 
            alert(`Recent Votes: ${JSON.stringify(resp.data,null, 2)}`)
        )
        .catch((error) => {
                console.error(error);
                setErrorMessage(error.message);
        });
    }
    return (
        <>
            <div className="container mb-5">
                <h2 className="mb-3">Get Recent Votes</h2>
                {errorMessage ? (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                ) : null}
                <Button className="m-1" variant="primary" onClick={handleSubmit} disabled={!signer}>
                    Submit
                </Button>
            </div>
        </>
    );
}