import React, { useContext, useEffect, VFC } from 'react'

import { mindMapDataActionType as actionType } from '~/store/reducer/MindMapDataReducer'
import { MindMapDispatchCtx, MindMapStateCtx } from '~/store/context/MindMapDataCtx'

import { scrollToOrigin } from '~/components/organisms/Origin'

import KeyInput from '~/domain/model/KeyInput'

import { isMovingScreen, Shortcut, shortcuts } from '~/enum/Shortcut'
import ArrowKey from '~/enum/ArrowKeys'

const keyInput = new KeyInput()

type Props = {
  setIsShitEnter: (isShiftEnter: boolean) => void
}

const KeyInputManager: VFC<Props> = (props) => {
  const mindMapData = useContext(MindMapStateCtx)
  const dispatchMindMapData = useContext(MindMapDispatchCtx)

  const handleKeydown = (e: KeyboardEvent) => {
    keyInput.add(e.key)

    const arrowKey = keyInput.getArrowKey()
    arrowKey && handleArrowKey(e, arrowKey)

    const shortcut = keyInput.getShortcut()
    shortcut && handleShortcut(e, shortcut)
  }

  const handleArrowKey = (e: KeyboardEvent, arrowKey: ArrowKey) => {
    // Prevent moving screen
    e.preventDefault()

    dispatchMindMapData({
      type: actionType.processArrowKey,
      payload: { arrowKey },
    })
  }

  const handleShortcut = (e: KeyboardEvent, shortcut: Shortcut) => {
    props.setIsShitEnter(shortcut === shortcuts.ShiftEnter)

    if (mindMapData.isInputting()) {
      if (shortcut === shortcuts.Enter) {
        exitEstimateEditMode()
      }

      return
    }

    if (isMovingScreen(shortcut)) {
      e.preventDefault()
    }
    if (shortcut === shortcuts.F6) {
      scrollToOrigin()
      return
    }

    dispatchMindMapData({
      type: actionType.processShortcut,
      payload: { shortcut },
    })
  }

  const exitEstimateEditMode = () => {
    dispatchMindMapData({
      type: actionType.exitEstimateTimeEditMode,
      payload: { id: mindMapData.findNodeIsSelected()?.id },
    })
  }

  const handleKeyup = (e: KeyboardEvent) => {
    keyInput.leave(e.key)
  }

  const keydownEffect = (): (() => void) => {
    document.body.addEventListener('keydown', handleKeydown)
    return () => document.body.removeEventListener('keydown', handleKeydown)
  }

  const keyupEffect = (): (() => void) => {
    document.body.addEventListener('keyup', handleKeyup)
    return () => document.body.removeEventListener('keyup', handleKeyup)
  }

  useEffect(keydownEffect, [handleKeydown])
  useEffect(keyupEffect, [])

  return <></>
}

export default KeyInputManager
