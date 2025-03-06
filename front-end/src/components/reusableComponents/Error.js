function Error({error}){
    if (!error) return null;

    // Ensure error is always a string
    const errorMessage = typeof error === "string" ? error : error.message || "An error occurred";
  
    return <div style={{ color: "red" }}>{errorMessage}</div>;
}

export default Error;