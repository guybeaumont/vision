import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { generateID } from '../../function';
import * as menu from '../../menu';

const MenuLink = ({ label, to, external }) =>
    external ? (
        <a className="menu-link" title={label} href={to} target="_blank" rel="noopener noreferrer">
            {label}
        </a>
    ) : (
        <Link className="menu-link" title={label} to={to}>
            {label}
        </Link>
    );

MenuLink.propTypes = {
    label: PropTypes.string,
    to: PropTypes.string,
    external: PropTypes.bool,
};

MenuLink.defaultProps = {
    label: undefined,
    to: undefined,
    external: false,
};

const MenuList = ({ list, label, to }) => {
    const loopList = list.map(({ label, to, external }) => (
        <li key={generateID()} className="menu-item">
            <MenuLink label={label} to={to} external={external} />
        </li>
    ));
    return <ul className="menu-list">{loopList}</ul>;
};

MenuList.propTypes = {
    list: PropTypes.array,
    label: PropTypes.string,
    to: PropTypes.string,
};

MenuList.defaultProps = {
    list: undefined,
    label: undefined,
    to: undefined,
};

const MenuFooter = () => (
    <div className="row gutter-50 gutter-lg-80">
        <div className="col-lg">
            <MenuList list={menu.FOOTER_ONE} />
        </div>
        <div className="col-lg">
            <MenuList list={menu.FOOTER_TWO} />
        </div>
        <div className="col-lg">
            <MenuList list={menu.FOOTER_THREE} />
        </div>
        <div className="col-lg">
            <MenuList list={menu.FOOTER_FOUR} />
        </div>
    </div>
);

export default MenuFooter;
