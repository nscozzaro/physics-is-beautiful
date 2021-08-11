import React from 'react'

import { ConfigurationFile } from '@codesandbox/common/lib/templates/configuration/types'
import getUI from '@codesandbox/common/lib/templates/configuration/ui'
import theme from '@codesandbox/common/lib/theme'
import { Module } from '@codesandbox/common/lib/types'
import { TextOperation } from 'ot'

// import EntryIcons from 'pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
//courses/static/courses/js/containers/StudioViews/EditorsViews/containers/LessonWorkSpace/Codesandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons
import EntryIcons from '../../../../../Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons'
import getType from '../../../../../app/utils/get-type'

import { Props as EditorProps, Editor } from '../../types'; // eslint-disable-line

import { Container, Title, Description } from './elements'

type Disposable = {
  dispose: () => void
}

type Props = EditorProps & {
  config: ConfigurationFile
  toggleConfigUI: () => void
  onDidChangeDirty: (cb: () => void) => Disposable
  getCode: () => string
  onChangeVSCode: (val: string) => void
  onDispose: (cb: () => void) => void
  openText: () => void
}

export class Configuration extends React.PureComponent<Props>
  implements Editor {
  disposeInitializer: Function
  currentModule: Module
  dirtyChangeListener: Disposable
  receivingCode: boolean = false

  constructor(props: Props) {
    super(props)

    this.registerListeners()
  }

  registerListeners() {
    if (this.props.onDidChangeDirty) {
      this.dirtyChangeListener = this.props.onDidChangeDirty(() => {
        this.forceUpdate()
        this.props.onChange(
          this.props.getCode(),
          this.props.currentModule.shortid,
        )
      })
    }

    this.props.onDispose(() => {
      this.dirtyChangeListener.dispose()
    })
  }

  componentDidMount() {
    if (this.props.onInitialized) {
      this.disposeInitializer = this.props.onInitialized(this)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentModule.id !== this.props.currentModule.id) {
      this.dirtyChangeListener.dispose()

      this.registerListeners()
    }
  }

  componentWillUnmount() {
    if (this.disposeInitializer) {
      this.disposeInitializer()
    }
  }

  sendLiveChanges = (code: string) => {
    const { sendTransforms, isLive, onCodeReceived } = this.props
    if (sendTransforms) {
      const oldCode = this.currentModule.code || ''

      // We don't know exactly what changed, just that the code changed. So
      // we send the whole code.

      const op = new TextOperation()

      op.delete(oldCode.length)
      op.insert(code)

      sendTransforms(op)
    } else if (!isLive && onCodeReceived) {
      onCodeReceived()
    }
  }

  updateFile = (code: string) => {
    const { isLive, sendTransforms } = this.props

    if (isLive && sendTransforms && !this.receivingCode) {
      this.sendLiveChanges(code)
    }

    this.props.onChangeVSCode(code)
  }

  render() {
    const { config, width, height, sandbox } = this.props
    const { currentModule } = this.props

    const { ConfigWizard } = getUI(config.type)

    return (
      <Container style={{ width, height }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EntryIcons
            width={32}
            height={32}
            type={getType(currentModule.title)}
          />
          <Title>{config.title}</Title>
        </div>
        <button
          type="button"
          style={{
            outline: 0,
            border: 0,
            backgroundColor: 'transparent',
            color: theme.secondary(),
            textDecoration: 'underline',
            margin: 0,
            padding: 0,
            marginTop: '1rem',
            cursor: 'pointer',
          }}
          tabIndex={-1}
          onClick={() => this.props.openText()}
        >
          Open file in editor
        </button>
        <Description>
          {config.description}{' '}
          <a
            href={config.moreInfoUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            More info...
          </a>
        </Description>

        <ConfigWizard
          sandbox={sandbox}
          updateFile={this.updateFile}
          file={this.props.getCode()}
        />
      </Container>
    )
  }
}
