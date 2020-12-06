import React from 'react';
import './Nav.scss';
// import Logo from '../../Logo/Logo';
import ongaku from '../../../assets/ongaku-2.svg';
import { OnClickRoute } from '../../../helpers/onClickRoute';
import LoginButton from '../LoginButton/LoginButton';

const Nav: React.FC = () => {
  const handleClick = OnClickRoute();

  return (
    <>
      <div className="home_nav">
        <div className="nav_buttons">
          <LoginButton
            text="Login"
            width="30%"
            fontSize="1rem"
            styles={false}
            discogsLogo={2}
          />
        </div>
        {/* <Logo
          widthPx={50}
          innerColor="#fefefe"
          outerColor="#0f0e0e"
          textColor="#065dc2"
        /> */}
        <img className="nav_logo" src={ongaku} alt="ongaku-logo" />
        <button
          type="submit"
          className="nav_buttons"
          onClick={() => handleClick('dashboard')}
        >
          Channels
        </button>
      </div>
    </>
  );
};

export default Nav;
