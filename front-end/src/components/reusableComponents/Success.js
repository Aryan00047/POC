function Success({message}){
    if (!message) return null;

    // Ensure success is always a string
    const successMessage = typeof message === "string" ? message : "Action successful!";
  
    return <div style={{ color: "green" }}>{successMessage}</div>;
}

export default Success;