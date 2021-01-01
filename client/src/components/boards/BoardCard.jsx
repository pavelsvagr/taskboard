import React from "react"

import { Card, Descriptions, Tag, Tooltip } from "antd"
import Highlighter from "react-highlight-words"
import {
  ClockCircleOutlined,
  IdcardOutlined,
  SnippetsOutlined,
} from "@ant-design/icons"
import { getIntervalTypeColor } from "helpers/intervalTypes"
import { getAssignmentTypeColor } from "helpers/assignmentTypes"
import PropTypes from "prop-types"
import shapes from "types"

const BoardCard = ({ onClick, actions = [], search, board }) => {
  const actionsReact = []
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i]
    const props = {
      key: action.key,
      onClick: () => action.onClick(board),
    }
    actionsReact.push(React.createElement(action.icon, props))
  }

  const tagColor = getAssignmentTypeColor(board.assignment)
  const tagIntervalColor = getIntervalTypeColor(board.intervals)

  return (
    <Card
      style={{
        background: `linear-gradient(to right bottom, ${tagColor}, ${tagIntervalColor})`,
      }}
      className="card--bordered"
      onClick={onClick ? () => onClick(board) : null}
      hoverable={onClick}
      actions={actionsReact}
      title={
        search ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#e6f7ff", padding: 0 }}
            searchWords={[search]}
            autoEscape
            textToHighlight={board.name}
          />
        ) : (
          board.name
        )
      }
    >
      <Descriptions
        size="small"
        column={1}
        colon={false}
        className={`descriptions--iconic  card-${board.credentials.type}`}
      >
        <Descriptions.Item
          key="identifier"
          className="ellipsis"
          label={(
            <Tooltip title="Identifier">
              <IdcardOutlined />
            </Tooltip>
          )}
        >
          <div className="ellipsis" style={{ color: "#fff" }}>
            {search ? (
              <Highlighter
                highlightStyle={{ backgroundColor: "#e6f7ff", padding: 0 }}
                searchWords={[search]}
                autoEscape
                textToHighlight={board.identifier}
              />
            ) : (
              board.identifier
            )}
          </div>
        </Descriptions.Item>
        <Descriptions.Item
          key="assignment"
          label={(
            <Tooltip title="Assignment">
              <SnippetsOutlined />
            </Tooltip>
          )}
        >
          <Tag color={tagColor}>{board.assignment}</Tag>
        </Descriptions.Item>
        <Descriptions.Item
          key="intervals"
          label={(
            <Tooltip title="Intervals">
              <ClockCircleOutlined />
            </Tooltip>
          )}
        >
          <Tag color={tagIntervalColor}>{board.intervals}</Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}

BoardCard.propTypes = {
  onClick: PropTypes.func,
  actions: PropTypes.arrayOf(PropTypes.object),
  search: PropTypes.string,
  board: shapes.board,
}

BoardCard.defaultProps = {
  onClick: null,
  actions: [],
  search: null,
  board: null,
}

export default BoardCard
