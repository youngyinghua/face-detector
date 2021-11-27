import React from "react";

const FaceRecognition = ({ imgUrl, boxAreas, urlReady }) => {
  //! define this.state.boxAreas as {} could lead to .map function an error
  //! even it appears to be an Array when detecting multi face. A single face is Ok.
  const boxes = boxAreas.map((item, i) => {
    const mystyle = {
      top: (100 * item.top_row).toString() + "%",
      left: (100 * item.left_col).toString() + "%",
      right: (100 * (1 - item.right_col)).toString() + "%",
      bottom: (100 * (1 - item.bottom_row)).toString() + "%",
    };
    return <div key={i} className="boundingbox" style={mystyle}></div>;
  });
  if (urlReady) {
    return (
      <div className="center container">
        <img alt="" className="" src={imgUrl} />
        {boxes}
      </div>
    );
  } else {
    return null;
  }
};
export default FaceRecognition;
