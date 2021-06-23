// Libraries
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as FaIcons from '@fortawesome/free-solid-svg-icons'
import * as FaRegularIcons from '@fortawesome/free-regular-svg-icons'

// import styles from "./faIcon.scss";

export const IconLibrary = {
  eye: FaIcons.faEye,
  info: FaIcons.faInfoCircle,
  'arrow-up': FaIcons.faArrowUp,
  'arrow-down': FaIcons.faArrowDown,
  'arrow-right': FaIcons.faArrowRight,
  'arrow-left': FaIcons.faArrowLeft,
  sync: FaIcons.faSync,
  folder: FaIcons.faFolder,
  'folder-open': FaIcons.faFolderOpen,
  file: FaIcons.faFile,
  'file-image': FaIcons.faFileImage,
  'file-pdf': FaIcons.faFilePdf,
  'file-csv': FaIcons.faFileCsv,
  upload: FaIcons.faUpload,
  download: FaIcons.faDownload,
  trash: FaIcons.faTrash,
  eraser: FaIcons.faEraser,
  gift: FaIcons.faGift,
  share: FaIcons.faShare,
  'share-alt': FaIcons.faShareAlt,
  times: FaIcons.faTimes,
  spinner: FaIcons.faSpinner,
  bell: FaIcons.faBell,
  'chart-bar': FaIcons.faChartBar,
  'thumbs-up': FaIcons.faThumbsUp,
  'thumbs-down': FaIcons.faThumbsDown,
  check: FaIcons.faCheck,
  database: FaIcons.faDatabase,
  bars: FaIcons.faBars,
  clone: FaIcons.faClone,
  edit: FaIcons.faEdit,
  plus: FaIcons.faPlus,
  'external-link': FaIcons.faExternalLinkAlt,
  sun: FaIcons.faSun,
  moon: FaIcons.faMoon,
  'caret-down': FaIcons.faCaretDown,
  'user-circle': FaIcons.faUserCircle,
}

export const RegularIconLibrary = {
  clone: FaRegularIcons.faClone,
  trash: FaRegularIcons.faTrashAlt,
  edit: FaRegularIcons.faEdit,
  smile: FaRegularIcons.faSmile,
  frown: FaRegularIcons.faFrown,
  meh: FaRegularIcons.faMeh,
  save: FaRegularIcons.faSave,
  sun: FaRegularIcons.faSun,
  moon: FaRegularIcons.faMoon,
}

export type Props = { className?: string } & (
  | { icon: keyof typeof IconLibrary; regularIcon?: never }
  | { icon?: never; regularIcon: keyof typeof RegularIconLibrary }
)

const Icon = ({ icon, regularIcon, className = '' }: Props) => (
  <>
    {icon && <FontAwesomeIcon className={className} icon={IconLibrary[icon]} />}
    {regularIcon && <FontAwesomeIcon className={className} icon={RegularIconLibrary[regularIcon]} />}
  </>
)

export default Icon
