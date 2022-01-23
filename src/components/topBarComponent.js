import React from 'react';

function TopBarComponent(props){
    return (
        <header className="Navbar">
        <div className="Toolbar">
            <table className='toolbar-content'>
                <tbody>
                    <tr>
                        <td>
                            <div style={{marginLeft:'10px', width:'100px'}}>
                                <img src={require('./img/articulate-logo-smol.png')} alt="Logo" className='logo'/>
                            </div>
                        </td>

                        <td>
                            <div className='cmd-area' style={props.cmdText ? {color: 'white'} : {color: 'grey'}}>
                                {props.cmdText ? props.cmdText : 'say something...'}
                            </div>
                        </td>

                        <td>
                            <div style={{textAlign:'right', color:'white'}}>
                                <button className='help-button' onClick={()=>{props.setHelpDisplay(!props.helpDisplay)}}>
                                    <img src={require('./img/help-icon.png')} alt='help-icon' className='help-icon'/>
                                </button>
                                
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </header>
    ); 
}

export default TopBarComponent; 