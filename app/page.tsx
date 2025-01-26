'use client'

import styles from './page.module.css'
import { useState, useRef } from 'react'
import { btnArr } from './lib/constant'
import createSelect from './lib/useCreate'
import { Button, Upload, Badge, message, Modal } from 'antd'
import { UploadChangeParam } from 'antd/es/upload'
import '@ant-design/v5-patch-for-react-19'

export default function Home() {
  const [bgPic, setBgPic] = useState<string>('') //背景图
  //框选数组
  const [selectBoxArr, setSelectBoxArr] = useState<(HTMLElement | null)[]>(
    new Array(btnArr.length).fill(null)
  )
  // 现在的index
  const [selectBoxIndex, setSelectBoxIndex] = useState<number>(0)

  const imgContainerRef = useRef<HTMLImageElement | null>(null) //图片容器
  const startCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 }) //开始坐标
  const endCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 }) //结束坐标
  const xyCoords = useRef<xyCoords>({ x: 0, y: 0 }) //选中时的xy坐标
  const isMousePressed = useRef<boolean>(false)
  const isMoveChangePressed = useRef<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const uploadProps = {
    name: 'image',
    action: 'https://api.imgbb.com/1/upload',
    data: {
      key: 'a578ea3b5fd1ba920224309e5cd531d8'
    },
    onChange(info: UploadChangeParam) {
      console.log('uploadProps', info)
      if (info.file.status === 'done') {
        if (info.file.response.status === 200) {
          setBgPic(info.file.response.data.url)
          message.success('上传图片成功')
        } else {
          message.error('上传图片失败')
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    withCredentials: false
  }

  const beginListener = (index: number) => {
    if (!bgPic || !imgContainerRef.current) return
    const imgContainer = imgContainerRef.current

    // 先检查是否已存在
    if (selectBoxArr[index]) {
      removeSelect(index)
    }

    const newSelectBox = createSelect({
      xyCoords,
      isMoveChangePressed: isMoveChangePressed.current,
      index,
      setSelectBoxIndex,
      imgContainerHeight: (imgContainer.childNodes[0] as HTMLElement)
        .clientHeight,
      imgContainerWidth: (imgContainer.childNodes[0] as HTMLElement)
        .clientWidth,
      removeSelect
    })

    // 立即更新状态
    setSelectBoxArr(prev => {
      const newArr = [...prev]
      newArr[index] = newSelectBox
      return newArr
    })
    setSelectBoxIndex(index)

    // 确保DOM操作在状态更新后
    imgContainer.appendChild(newSelectBox)

    // 抽取坐标计算逻辑
    const calculateCoords = (event: MouseEvent) => {
      return {
        x: event.clientX - imgContainer.offsetLeft,
        y: event.clientY - imgContainer.offsetTop
      }
    }

    // 抽取尺寸计算逻辑
    const calculateBoxDimensions = (
      start: typeof startCoords.current,
      end: typeof endCoords.current
    ) => {
      return {
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y),
        left: Math.min(start.x, end.x),
        top: Math.min(start.y, end.y)
      }
    }

    // 统一管理事件清理
    const cleanupListeners = () => {
      imgContainer.removeEventListener('mousedown', handleMouseDown)
      imgContainer.removeEventListener('mousemove', handleMouseMove)
      imgContainer.removeEventListener('mouseup', handleMouseUp)
    }

    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault()
      const coords = calculateCoords(event)
      startCoords.current = coords
      isMousePressed.current = true
    }

    const handleMouseMove = (event: MouseEvent) => {
      event.preventDefault()
      if (!isMousePressed.current) return

      endCoords.current = calculateCoords(event)
      const { width, height, left, top } = calculateBoxDimensions(
        startCoords.current,
        endCoords.current
      )

      // 使用新的引用而不是直接访问状态
      newSelectBox.style.left = `${left}px`
      newSelectBox.style.top = `${top}px`
      newSelectBox.style.width = `${width}px`
      newSelectBox.style.height = `${index === 2 ? width : height}px`
    }

    const handleMouseUp = () => {
      isMousePressed.current = false

      // 检查选择框是否有效
      if (
        !newSelectBox ||
        parseInt(newSelectBox.style.width || '0') <= 10 ||
        parseInt(newSelectBox.style.height || '0') <= 10
      ) {
        cleanupListeners()
        removeSelect(index)
        return
      }

      // 添加文本标签
      const textDiv = document.createElement('div')
      textDiv.innerText = btnArr.find(i => i.id === index)?.name || ''
      newSelectBox.appendChild(textDiv)

      // 确保状态与DOM同步
      setSelectBoxArr(prev => {
        const newArr = [...prev]
        newArr[index] = newSelectBox
        return newArr
      })

      cleanupListeners()
    }

    imgContainer.addEventListener('mousedown', handleMouseDown)
    imgContainer.addEventListener('mousemove', handleMouseMove)
    imgContainer.addEventListener('mouseup', handleMouseUp)
  }

  const removeSelect = (index: number) => {
    setSelectBoxArr(prev => {
      const newArr = [...prev]
      const element = newArr[index]

      if (element) {
        try {
          // 确保DOM元素被移除
          element.remove()
        } catch (error) {
          console.error('移除DOM元素时发生错误:', error)
        }
      }

      newArr[index] = null
      return newArr
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.btnBox}>
        <Upload {...uploadProps}>
          <Button type="primary">{bgPic ? '重新上传' : '上传背景图'}</Button>
        </Upload>
        {btnArr.map(btnItem =>
          selectBoxArr[btnItem.id] !== null ? (
            <Badge.Ribbon text="已设置" color="red" key={btnItem.id}>
              <Button key={btnItem.id} type="primary">
                {btnItem.name}
              </Button>
            </Badge.Ribbon>
          ) : (
            <Button
              key={btnItem.id}
              type="primary"
              onClick={() => beginListener(btnItem.id)}
              disabled={selectBoxArr[btnItem.id] !== null}
            >
              {btnItem.name}
            </Button>
          )
        )}
      </div>
      {bgPic ? (
        <div ref={imgContainerRef} className={styles.imgContainer}>
          <img src={bgPic} draggable="false" alt="bgPic" />
        </div>
      ) : (
        <div className={styles.emptyBox}>请先上传背景图</div>
      )}
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        导出
      </Button>
      <Modal
        title="Selected Data"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        {selectBoxArr.map((item, index) => (
          <div key={index}>
            {btnArr[index].name}
            <br />
            distance top: {item?.style.top}
            <br />
            distance left: {item?.style.left}
            <br />
            width: {item?.style.width}
            <br />
            height: {item?.style.height}
          </div>
        ))}
      </Modal>
    </div>
  )
}
