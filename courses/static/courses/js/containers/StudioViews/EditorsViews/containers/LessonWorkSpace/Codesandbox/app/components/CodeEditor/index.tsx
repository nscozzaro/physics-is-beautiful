import React from 'react'

import Centered from '@codesandbox/common/lib/components/flex/Centered'
import Margin from '@codesandbox/common/lib/components/spacing/Margin'
import Tooltip from '@codesandbox/common/lib/components/Tooltip'
import { getModulePath } from '@codesandbox/common/lib/sandbox/modules'
import getDefinition from '@codesandbox/common/lib/templates'
// import getUI from '@codesandbox/common/lib/templates/configuration/ui';
import { Sandbox } from '@codesandbox/common/lib/types'
import isImage from '@codesandbox/common/lib/utils/is-image'
import { SubTitle } from '../../../app/components/SubTitle'
import { Title } from '../../../app/components/Title'
import Loadable from '../../../app/utils/Loadable'

import { MdDvr as UIIcon } from 'react-icons/md'
import { GoQuestion as QuestionIcon } from 'react-icons/go'

// import QuestionIcon from 'react-icons/lib/go/question';
// import UIIcon from 'react-icons/lib/md/dvr';

import { Configuration } from './Configuration'
import { Icon, Icons } from './elements'
import { ImageViewer } from './ImageViewer'
import MonacoDiff from './MonacoDiff'
import { Props } from './types'; // eslint-disable-line
import { VSCode } from './VSCode'

// const CodeMirror = Loadable(() =>
//   import(/* webpackChunkName: 'codemirror-editor' */ './CodeMirror')
// );

// const Monaco = Loadable(() =>
//   import(/* webpackChunkName: 'codemirror-editor' */ './Monaco')
// );

const getDependencies = (sandbox: Sandbox): { [key: string]: string } => {
  const packageJSON = sandbox.modules.find(
    m => m.title === 'package.json' && m.directoryShortid == null,
  )

  if (packageJSON != null) {
    try {
      const { dependencies = {}, devDependencies = {} } = JSON.parse(
        packageJSON.code || '',
      )

      const usedDevDependencies = {}
      Object.keys(devDependencies).forEach(d => {
        if (d.startsWith('@types')) {
          usedDevDependencies[d] = devDependencies[d]
        }
      })

      return { ...dependencies, ...usedDevDependencies }
    } catch (e) {
      console.error(e)
      return null
    }
  } else {
    return typeof sandbox.npmDependencies.toJS === 'function'
      ? (sandbox.npmDependencies as any).toJS()
      : sandbox.npmDependencies
  }
}

type State = {
  showConfigUI: boolean
}

export class CodeEditor extends React.PureComponent<
  Props & {
    editor?: 'vscode' | 'monaco' | 'codemirror'
    style?: React.CSSProperties
  },
  State
> {
  state = {
    showConfigUI: true,
  }

  toggleConfigUI = () => {
    this.setState(state => ({ showConfigUI: !state.showConfigUI }))
  }

  render() {
    const { props } = this

    const {
      isModuleSynced,
      currentTab,
      sandbox,
      currentModule: module,
      settings,
    } = props

    if (currentTab && currentTab.type === 'DIFF') {
      return (
        <div
          style={{
            height: props.height || '100%',
            width: props.width || '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <MonacoDiff
            originalCode={currentTab.codeA}
            modifiedCode={currentTab.codeB}
            title={currentTab.fileTitle}
            {...props}
          />
        </div>
      )
    }

    const dependencies = getDependencies(sandbox)

    // const template = getDefinition(sandbox.template);
    // const modulePath = getModulePath(
    //   sandbox.modules,
    //   sandbox.directories,
    //   module.id
    // );
    // const config = template.configurationFiles[modulePath];

    // if (
    //   !settings.experimentVSCode &&
    //   config &&
    //   getUI(config.type) &&
    //   this.state.showConfigUI
    // ) {
    //   return (
    //     <Configuration
    //       {...props}
    //       dependencies={dependencies}
    //       config={config}
    //       toggleConfigUI={this.toggleConfigUI}
    //     />
    //   );
    // }

    // if (!settings.experimentVSCode && module.isBinary) {
    //   if (isImage(module.title)) {
    //     return <ImageViewer {...props} dependencies={dependencies} />;
    //   }
    //
    //   return (
    //     <Margin
    //       style={{
    //         overflow: 'auto',
    //         height: props.height || '100%',
    //         width: props.width || '100%',
    //       }}
    //       top={2}
    //     >
    //       <Centered horizontal vertical>
    //         <Title>This file is too big to edit</Title>
    //         <SubTitle>
    //           We will add support for this as soon as possible.
    //         </SubTitle>
    //
    //         <a href={module.code} target="_blank" rel="noreferrer noopener">
    //           Open file externally
    //         </a>
    //       </Centered>
    //     </Margin>
    //   );
    // }

    // let Editor =
    //   settings.codeMirror && !props.isLive
    //     ? ((CodeMirror as unknown) as React.ComponentClass<Props>)
    //     : ((Monaco as unknown) as React.ComponentClass<Props>);

    // let Editor = ((Monaco as unknown) as React.ComponentClass<Props>);

    let Editor = VSCode as React.ComponentClass<Props>

    // if (settings.experimentVSCode) {
    //   Editor = VSCode as React.ComponentClass<Props>;
    // }

    return (
      <div
        style={{
          height: props.height || '100%',
          width: props.width || '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          ...props.style,
        }}
      >
        {!isModuleSynced(module.shortid) && module.title === 'index.html' && (
          <Icons>
            You may have to save this file and refresh the preview to see
            changes
          </Icons>
        )}
        {/*{config &&*/}
        {/*(getUI(config.type) && !settings.experimentVSCode ? (*/}
        {/*<Icons>*/}
        {/*<Tooltip content="Switch to UI Configuration">*/}
        {/*<Icon onClick={this.toggleConfigUI}>*/}
        {/*<UIIcon />*/}
        {/*</Icon>*/}
        {/*</Tooltip>*/}
        {/*</Icons>*/}
        {/*) : (*/}
        {/*<Icons>*/}
        {/*{config.partialSupportDisclaimer ? (*/}
        {/*<Tooltip*/}
        {/*placement="bottom"*/}
        {/*content={config.partialSupportDisclaimer}*/}
        {/*style={{*/}
        {/*display: 'flex',*/}
        {/*'align-items': 'center',*/}
        {/*}}*/}
        {/*>*/}
        {/*Partially Supported Config{' '}*/}
        {/*<QuestionIcon style={{ marginLeft: '.5rem' }} />*/}
        {/*</Tooltip>*/}
        {/*) : (*/}
        {/*<div>Supported Configuration</div>*/}
        {/*)}*/}
        {/*</Icons>*/}
        {/*))}*/}
        <Editor {...props} dependencies={dependencies} />
      </div>
    )
  }
}
