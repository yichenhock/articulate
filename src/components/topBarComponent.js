import React from 'react';

function TopBarComponent(props){
    return (
        <header className="Navbar">
        <div className="Toolbar">
            <table className='toolbar-content'>
            <tr>
                <td>
                    <div style={{marginLeft:'10px', width:'100px'}}>
                        <img src={require('./img/articulate-logo-smol.png')} alt="Logo" className='logo'/>
                    </div>
                </td>

                <td>
                    <div className='cmd-area'>
                    hi
                    </div>
                </td>

                <td>
                    <div style={{textAlign:'right', color:'white'}}>
                        
                    </div>
                </td>
            </tr>
            </table>

        </div>
      </header>
    ); 
}

export default TopBarComponent; 