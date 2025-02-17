import { FormControl } from "@chakra-ui/react"
import Switch from "components/common/Switch"
import { useFormContext } from "react-hook-form"

const HideFromExplorerToggle = (): JSX.Element => {
  const { register } = useFormContext()

  return (
    <FormControl>
      <Switch
        {...register("hideFromExplorer")}
        title="Hide from explorer"
        description="Your collab is verified, thus it is shown by default on the kindness.id explorer homepage. You can opt out of that here"
      />
    </FormControl>
  )
}

export default HideFromExplorerToggle
