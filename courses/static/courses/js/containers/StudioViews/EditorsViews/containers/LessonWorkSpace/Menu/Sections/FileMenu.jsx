import React from 'react'
import Button from '@material-ui/core/Button'
import ListItemText from '@material-ui/core/ListItemText'

import Title from '@material-ui/icons/Title'
import SaveAlt from '@material-ui/icons/SaveAlt'
import AddBoxIcon from '@material-ui/icons/AddBox'

import {
  StyledListItemIcon,
  StyledMenu,
  StyledMenuItem,
} from '../StyledComponents'
import PropTypes from 'prop-types'

export default function FileMenu({ handleAddMaterial }) {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <Button
        aria-controls="file-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="default"
      >
        File
      </Button>
      <StyledMenu
        id="file-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem
          onClick={() => {
            handleClose()
            handleAddMaterial()
          }}
        >
          <StyledListItemIcon>
            <AddBoxIcon />
          </StyledListItemIcon>
          <ListItemText primary="Add material" />
        </StyledMenuItem>
        {/* <StyledMenuItem> */}
        {/* <StyledListItemIcon> */}
        {/* <Title /> */}
        {/* </StyledListItemIcon> */}
        {/* <ListItemText primary='Rename material' /> */}
        {/* </StyledMenuItem> */}
        {/*<StyledMenuItem>*/}
        {/*  <StyledListItemIcon>*/}
        {/*    <SaveAlt />*/}
        {/*  </StyledListItemIcon>*/}
        {/*  <ListItemText primary="Save as.." />*/}
        {/*</StyledMenuItem>*/}
      </StyledMenu>
    </React.Fragment>
  )
}

FileMenu.propTypes = {
  handleAddMaterial: PropTypes.func.isRequired,
}
