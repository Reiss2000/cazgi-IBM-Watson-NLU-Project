import React from "react";
import "./bootstrap.min.css";

class EmotionTable extends React.Component {
  render() {
    return (
      <div>
        <table className="table table-bordered">
          <tbody>
            {Object.entries(this.props.emotions).map(([emotion, value]) => {
              return (
                <tr>
                  <th className={emotion} scope="row">
                    {emotion}
                  </th>
                  <td>{value}</td>
                </tr>
              );
            })}
            {this.props.confidence && (
              <tr>
                <th className={this.props.confidence} scope="row">
                  Confidence
                </th>
                <td>{this.props.confidence}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
export default EmotionTable;
