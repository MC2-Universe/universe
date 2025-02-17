import { Badge, BadgeProps } from "@/components/ui/Badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
type Props = {
  size?: BadgeProps["size"]
}

const PrimaryAddressBadge = ({ size }: Props): JSX.Element => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Badge size={size}>Primary</Badge>
    </TooltipTrigger>
    <TooltipContent>
      <p>
        Collab owners will receive this address if they export members from their
        collab
      </p>
    </TooltipContent>
  </Tooltip>
)

export default PrimaryAddressBadge
