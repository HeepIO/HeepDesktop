import React from 'react';
const {PropTypes} = React;

const Icon = props => {
  
  const styles = {
    svg: {
      margin: 'auto',
      position: 'block',
      left: '30%',
      top: '30%',
      width: '40%',
      height: '100%',
      fill: props.color,
    },
    path: {
      fill: props.color,
    },
  };
  
  if(props.icon[0] == 'M'){
    return( <svg
      style={styles.svg}
      width={`${props.size}px`}
      height={`${props.size}px`}
      viewBox="0 0 1024 1024"
      >
        <path
          style={styles.path}
          d={props.icon}
        ></path>
      </svg>
      )
  }
  else {
    
    return(<svg
      style={styles.svg}
      width={`${props.size}px`}
      height={`${props.size}px`}
      viewBox={props.icon.viewBox}
      >
      {props.icon.paths}
      </svg>)
  }
};

Icon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

Icon.defaultProps = {
  size: 16,
};

export default Icon;