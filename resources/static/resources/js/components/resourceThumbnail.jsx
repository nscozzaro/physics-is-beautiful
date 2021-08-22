import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router'

import { Image } from 'react-bootstrap'
import { FaImage } from 'react-icons/fa'
import { BASE_URL } from '../utils/config'
import { slugify } from '../utils/urls'

// import history from '../history'

class ResourceThumbnail extends React.Component { // TODO create components for each resources types
  constructor (props) {
    super(props)
    this.onTitleClick = this.onTitleClick.bind(this)
  }

  onTitleClick (resourceUuid) {
    // var title = this.props.resource.metadata.data.volumeInfo.title
    let title = this.props.resource.title
    if (!title) {
      title = 'Unknown resource'
    }
    const { history } = this.props
    history.push(BASE_URL + slugify(title) + '/' + this.props.resource.uuid + '/')
  }

  render () {
    let title = this.props.resource.title
    if (!title) {
      try {
        title = this.props.resource.metadata.data.volumeInfo.title
      } catch (e) {
        if (e instanceof TypeError) {
          title = ''
        } else throw e
      }
    }

    return (
      <div
        className={'course-card'}>
        <div
          onClick={this.onTitleClick}
          style={{paddingBottom: '1rem',
            height: '200px',
            overflow: 'hidden',
            borderRadius: '15px',
            cursor: 'pointer'}}>
          { this.props.resource.metadata &&
            this.props.resource.metadata.data.hasOwnProperty('volumeInfo') &&
          this.props.resource.metadata.data.volumeInfo.hasOwnProperty('imageLinks') &&
          this.props.resource.metadata.data.volumeInfo.imageLinks.thumbnail
            ? <Image fluid src={this.props.resource.metadata.data.volumeInfo.imageLinks.thumbnail.replace(/^http:\/\//i, 'https://')} />
            : <FaImage size={'10em'} /> }
        </div>
        <div onClick={this.onTitleClick} className={'blue-text'} style={{fontSize: '1.5rem', cursor: 'pointer'}}>
          {/*<div>{*/}
            {/*this.props.resource.metadata.data.volumeInfo.title.length > 49*/}
              {/*? this.props.resource.metadata.data.volumeInfo.title.substr(0, 50) + '...'*/}
              {/*: this.props.resource.metadata.data.volumeInfo.title*/}
          {/*}</div>*/}
          <div> {
            title.length > 49
              ? title.substr(0, 50) + '...'
              : title
          }</div>
        </div>
        { this.props.resource.resource_type === 'TB' && this.props.resource.metadata
          ? <div>
            <div>{
              this.props.resource.metadata &&
              this.props.resource.metadata.data.volumeInfo.hasOwnProperty('authors') &&
              this.props.resource.metadata.data.volumeInfo.authors.map(function (author, i) {
                return <span key={author} style={{paddingRight: '1rem'}}>
                  {author}
                  {this.props.resource.metadata.data.volumeInfo.authors.length - 1 !== i ? ',' : null }
                </span> // TODO limit authors list
              }, this)}</div>
          </div>
          : null
        }
      </div>
    )
  }
}

ResourceThumbnail.propTypes = {
  resource: PropTypes.object.isRequired
}

export default withRouter(ResourceThumbnail)
