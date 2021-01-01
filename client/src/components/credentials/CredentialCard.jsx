import React from "react"

import { Avatar, Card } from "antd"
import Highlighter from "react-highlight-words"

import credentialTypes from "helpers/credentialTypes"
import PropTypes from "prop-types"
import shapes from "../../types"

const CredentialCard = ({
  onClick,
  actions = [],
  search,
  credentials,
  disabled,
}) => {
  const actionsReact = []
  for (let i = 0; i < actions.length; i += 1) {
    const action = actions[i]
    const props = {
      key: action.key,
      onClick: () => action.onClick(credentials),
    }
    actionsReact.push(React.createElement(action.icon, props))
  }

  const className = disabled ? "card--disabled" : null

  return (
    <Card
      className={className}
      onClick={
        onClick && !disabled
          ? () => {
              onClick(credentials)
            }
          : null
      }
      hoverable={onClick && !disabled}
      actions={actionsReact}
    >
      <Card.Meta
        title={
          search ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#40a9ff",
                padding: 0,
                color: "white",
              }}
              searchWords={[search]}
              autoEscape
              textToHighlight={credentials.name}
            />
          ) : (
            credentials.name
          )
        }
        description={
          search ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#40a9ff",
                padding: 0,
                color: "white",
              }}
              searchWords={[search]}
              autoEscape
              textToHighlight={credentials.url}
            />
          ) : (
            credentials.url
          )
        }
        avatar={(
          <Avatar
            size={60}
            shape="square"
            src={credentialTypes[credentials.type].logo}
          />
        )}
      />
    </Card>
  )
}

CredentialCard.propTypes = {
  onClick: PropTypes.func,
  actions: PropTypes.arrayOf(PropTypes.object),
  search: PropTypes.string,
  credentials: shapes.credentials,
  disabled: PropTypes.bool,
}

CredentialCard.defaultProps = {
  onClick: null,
  actions: [],
  search: null,
  credentials: null,
  disabled: false,
}

export default CredentialCard
