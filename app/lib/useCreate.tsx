import { RefObject } from 'react'

type CreateSelectParams = {
  xyCoords: RefObject<xyCoords>
  isMoveChangePressed: boolean
  index: number
  setSelectBoxIndex: (index: number) => void
  imgContainerHeight: number
  removeSelect: (index: number) => void
  imgContainerWidth: number
}

export default function createSelect({
  xyCoords,
  isMoveChangePressed,
  index,
  setSelectBoxIndex,
  imgContainerHeight,
  removeSelect,
  imgContainerWidth
}: CreateSelectParams) {
  const selectBox = document.createElement('div')
  selectBox.id = 'selectBox'
  selectBox.tabIndex = index
  selectBox.addEventListener('mousedown', (event: MouseEvent) => {
    event.stopPropagation()
    setSelectBoxIndex(index)
    xyCoords.current.x = event.offsetX
    xyCoords.current.y = event.offsetY
    isMoveChangePressed = true
  })
  selectBox.addEventListener('mousemove', (event: MouseEvent) => {
    if (!isMoveChangePressed) return
    event.stopPropagation()
    event.preventDefault()
    // 计算坐标：移动的坐标-开始坐标+盒子原本的坐标
    const moveX =
      event.offsetX - xyCoords.current.x + parseInt(selectBox.style.left)
    const moveY =
      event.offsetY - xyCoords.current.y + parseInt(selectBox.style.top)
    const maxLeft = imgContainerWidth - parseInt(selectBox.style.width)
    const maxTop = imgContainerHeight - parseInt(selectBox.style.height)
    selectBox.style.left = moveX + 'px'
    selectBox.style.top = moveY + 'px'
    if (moveX < 0) {
      selectBox.style.left = '0px'
    }
    if (moveX > maxLeft) {
      selectBox.style.left = maxLeft + 'px'
    }
    if (moveY < 0) {
      selectBox.style.top = '0px'
    }
    if (moveY > maxTop) {
      selectBox.style.top = maxTop + 'px'
    }
  })
  selectBox.addEventListener('mouseup', (event: MouseEvent) => {
    event.stopPropagation()
    isMoveChangePressed = false
  })
  selectBox.addEventListener('mouseleave', (event: MouseEvent) => {
    event.stopPropagation()
    isMoveChangePressed = false
  })
  selectBox.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key !== 'Delete') return
    removeSelect(index)
  })

  // 创建右上角删除按钮
  const deleteBtn = document.createElement('div')
  deleteBtn.id = 'deleteBtn'
  selectBox.appendChild(deleteBtn)
  deleteBtn.addEventListener('click', () => {
    removeSelect(index)
  })
  // 创建拖拽点
  // const dragBtn = document.createElement('div')
  // dragBtn.id = 'dragBtn'
  // selectBox.appendChild(dragBtn)
  // dragBtn.addEventListener('mousedown', (event: any) => {
  //   event.stopPropagation()
  //   isDragPressed = true
  // })
  // dragBtn.addEventListener('mousemove', (event: any) => {
  //   event.preventDefault()
  //   event.stopPropagation()
  //   if (!isDragPressed) return
  //   const boxWidth = Math.abs(
  //     event.clientX - 292 - parseInt(selectBox.style.left)
  //   )
  //   const boxHeight = Math.abs(
  //     event.clientY - 68 - parseInt(selectBox.style.top)
  //   )
  //   const boxLeft = Math.min(
  //     parseInt(selectBox.style.left),
  //     event.clientX - 292
  //   )
  //   const boxTop = Math.min(parseInt(selectBox.style.top), event.clientY - 68)

  //   selectBox.style.left = boxLeft + 'px'
  //   selectBox.style.top = boxTop + 'px'
  //   selectBox.style.width = boxWidth + 'px'
  //   selectBox.style.height = boxHeight + 'px'
  // })
  // dragBtn.addEventListener('mouseup', (event: any) => {
  //   event.stopPropagation()
  //   isDragPressed = false
  // })
  // dragBtn.addEventListener('mouseleave', (event: any) => {
  //   event.stopPropagation()
  //   isDragPressed = false
  // })

  return selectBox
}
