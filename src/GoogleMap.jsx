import React from "react";

const containerStyle = {
  width: "100%",
  height: "90vh",
  border: 0,
  loading: "lazy",
  referrerPolicy: "no-referrer-when-downgrade",
};

function MyComponent() {
  return (
    <div style={{ width: "100%", height: "450px" }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14291.660911801642!2d80.37576189037017!3d26.42621209670992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c40dfd9e7f671%3A0x4c58115704d418f1!2sLal%20Bangla%2C%20J%20K%20Puri%2C%20Kanpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1718004569845!5m2!1sen!2sin"
        style={containerStyle}
        width="600"
        height="800"
        title="Google Map"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default React.memo(MyComponent);
