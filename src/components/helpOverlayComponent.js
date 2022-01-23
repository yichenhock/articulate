import React from 'react';
import './styles.css';

function HelpOverlay(props) {
  return (
    <div className='help-overlay'>
      <div className='help-title'>speech commands</div>
      <table className='help-table'>
        <tr>
          <td>
            <table>
              <tr>
                <td>LEFT</td>
                <td>Move the pen left</td>
              </tr>
              <tr>
                <td>RIGHT</td>
                <td>Move the pen right</td>
              </tr>
              <tr>
                <td>UP</td>
                <td>Move the pen up</td>
              </tr>
              <tr>
                <td>DOWN</td>
                <td>Move the pen down</td>
              </tr>
              <tr>
                <td>RED</td>
                <td>Mix a red paint</td>
              </tr>
              <tr>
                <td>GREEN</td>
                <td>Mix a green paint</td>
              </tr>
              <tr>
                <td>BLUE</td>
                <td>Mix a blue paint</td>
              </tr>
              <tr>
                <td>GO</td>
                <td>Begin moving</td>
              </tr>
              <tr>
                <td>STOP</td>
                <td>Stop moving</td>
              </tr>
              <tr>
                <td>PAINT</td>
                <td>Move the brush across the canvas</td>
              </tr>
              <tr>
                <td>MOVE</td>
                <td>Move the brush off the canvas</td>
              </tr>
            </table>
          </td>
          <td>
            <table>
              <tr>
                <td>QUICK</td>
                <td>Increase brush stroke velocity</td>
              </tr>
              <tr>
                <td>SLOW</td>
                <td>Reduce brush stroke velocity</td>
              </tr>
              <tr>
                <td>BOLD</td>
                <td>Increase brush stroke thickness</td>
              </tr>
              <tr>
                <td>SHRINK</td>
                <td>Reduce brush stroke thickness</td>
              </tr>
              <tr>
                <td>MORE</td>
                <td>Add more colour to a colour mix</td>
              </tr>
              <tr>
                <td>LESS</td>
                <td>Remove colour from a colour mix</td>
              </tr>
              <tr>
                <td>MIX</td>
                <td>Begin mixing colours</td>
              </tr>
              <tr>
                <td>BLACK</td>
                <td>Mix a black paint</td>
              </tr>
              <tr>
                <td>WHITE</td>
                <td>Mix a white paint</td>
              </tr>
              <tr>
                <td>CLEAR</td>
                <td>Start a new canvas</td>
              </tr>
              <tr>
                <td>SAVE</td>
                <td>Save your painting</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  );

};

export default HelpOverlay; 