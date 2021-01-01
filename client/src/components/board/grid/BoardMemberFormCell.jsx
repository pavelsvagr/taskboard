import React from 'react'
import {Button, Col, Form, Input, Space} from "antd"
import {connect} from "react-redux"
import PropTypes from "prop-types"
import {CheckOutlined, CloseOutlined} from "@ant-design/icons"
import {fetchBoard, updateBoardMember} from "../../../actions"
import {renderAntItem} from "../../../helpers/forms"
import shapes from "../../../types"
import FormSubmit from "../../comon/inputs/FormSubmit"
import {editMemberNickname} from "../../../actions/boardToolsAction"

function BoardMemberFormCell(
  {
    board,
    member,
    span,
    avatar,
    dragButton,
    updateBoardMember: updateMember,
    editMemberNickname: editNickname,
    fetchBoard: fetchAction,
    ...props
  }) {

  const initialValues = {
    nickname: member?.nickname,
  }

  const rules = {
    nickname: [
      {type: "string", message: "Name must be a valid string."},
      {required: true, message: "Name is required."},
      {min: 3, message: "Name must be at least 3 chars long."},
      {max: 100, message: "Name must be max 100 chars long."},
    ]
  }

  const items = {
    nickname: {
      name: "nickname",
      rules: rules.nickname,
      hasFeedback: true,
      help: false
    },
  }

  const onSubmit = (values) => {
    const {identifier} = board
    const {nickname} = values

    updateMember(identifier, member._id, {
      nickname: nickname.trim(),
    })
    editNickname(null)
  }

  return (
    <Col className="board__col" {...span} {...props}>
      <Space>
        {dragButton && (
        <div className="board__col__toolbar">{dragButton}</div>
          )}
        {avatar}
        <Form onFinish={onSubmit} initialValues={initialValues} layout="inline" wrapperCol={24}>
          {renderAntItem('nickname', items.nickname, [], <Input />)}
          <Space>
            <Button onClick={() => editNickname(null)} size="small">
              <CloseOutlined />
            </Button>
            <FormSubmit size="small" title={<CheckOutlined />} inline />
          </Space>
        </Form>
      </Space>
    </Col>
  )
}

BoardMemberFormCell.propTypes = {
  span: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  updateBoardMember: PropTypes.func.isRequired,
  fetchBoard: PropTypes.func.isRequired,
  editMemberNickname: PropTypes.func.isRequired,
  board: shapes.board,
  member: shapes.member,
  avatar: PropTypes.node,
  dragButton: PropTypes.node,
}

BoardMemberFormCell.defaultProps = {
  span: {},
  board: null,
  member: null,
  dragButton: null,
  avatar: null
}

function mapStateToProps({boards, boardTools}) {
  return {board: boards?.board, member: boardTools?.editMember}
}

export default connect(mapStateToProps, {fetchBoard, updateBoardMember, editMemberNickname})(BoardMemberFormCell)