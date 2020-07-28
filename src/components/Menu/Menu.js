import React, { Component } from 'react';
import { StyledMenu, StyledMenuItem } from './styles';

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      target: props.target,
      items: props.items || [],
      onDismiss: props.onDismiss,
      onClick: props.onClick,
    };
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleClick, false);
  }

  handleClick = (e) => {
    if (this.menuRef.contains(e.target)) {
      return;
    }

    this.state.onDismiss && this.state.onDismiss();
  };

  render() {
    return (
      <StyledMenu
        ref={(menuRef) => (this.menuRef = menuRef)}
        style={{
          left: this.state.target.offsetLeft,
          top: this.state.target.offsetTop,
        }}>
        {this.state.items.map((item, i) => (
          <StyledMenuItem
            key={i}
            onClick={() => this.state.onClick && this.state.onClick(i)}>
            {item}
          </StyledMenuItem>
        ))}
      </StyledMenu>
    );
  }
}
