import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { createColor, useColorPalette } from "hooks/useColorPalette"
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

const ThemeContext = createContext<{
  localThemeColor: string
  setLocalThemeColor: Dispatch<SetStateAction<string>>
  localBackgroundImage?: string
  setLocalBackgroundImage: Dispatch<SetStateAction<string | undefined>>
  textColor: string
  buttonColorScheme: string
  buttonColorSchemeClassName: string // Temp, until we finish the Tailwind migration
  avatarBg: string
}>({
  localThemeColor: "#27272a",
  setLocalThemeColor: () => {
    /* empty */
  },
  localBackgroundImage: undefined,
  setLocalBackgroundImage: () => {
    /* empty */
  },
  textColor: "inherit",
  buttonColorScheme: "secondary",
  buttonColorSchemeClassName: "",
  avatarBg: "#27272a",
})

const ThemeProvider = memo(({ children }: PropsWithChildren): JSX.Element => {
  const { theme } = useGuild()
  const { backgroundImage } = theme ?? {}
  const themeColorFallback = useColorModeValue("#27272a", "#18181b")
  const themeColor = theme?.color || themeColorFallback

  const [localThemeColor, setLocalThemeColor] = useState(themeColor)
  const [localBackgroundImage, setLocalBackgroundImage] = useState(backgroundImage)
  const generatedColors = useColorPalette("chakra-colors-primary", localThemeColor)
  const { colorMode } = useColorMode()

  // the initial value isn't enough, have to keep them in sync when they change due to SWR refetch
  useEffect(() => {
    setLocalThemeColor(themeColor)
  }, [themeColor])
  useEffect(() => {
    setLocalBackgroundImage(backgroundImage)
  }, [backgroundImage])

  const textColor = useMemo(() => {
    if (colorMode === "dark" || localBackgroundImage) return "whiteAlpha.900"
    const color = createColor(localThemeColor || "white")
    const saturation = color.hsl().array()[1]
    return color.luminosity() > 0.6 && saturation < 70
      ? "primary.800"
      : "whiteAlpha.900"
  }, [colorMode, localBackgroundImage, localThemeColor])

  const buttonColorScheme =
    textColor === "whiteAlpha.900" ? "whiteAlpha" : "blackAlpha"

  const buttonColorSchemeClassName =
    textColor === "whiteAlpha.900"
      ? "bg-white/[0.16] hover:bg-white/[0.24] active:bg-white/[0.36] text-banner-foreground"
      : "bg-black/[0.06] hover:bg-black/[0.08] active:bg-black/[0.16] text-banner-foreground"

  const bannerForegroundHSL = createColor(
    generatedColors.chakraVariables["--chakra-colors-primary-800"]
  )
    .hsl()
    .array()
  const bannerOpacity = textColor === "primary.800" ? 1 : 0.5
  const avatarBg =
    textColor === "primary.800" ? "bg-banner-foreground" : "bg-transparent"

  return (
    <ThemeContext.Provider
      value={{
        localThemeColor,
        setLocalThemeColor,
        localBackgroundImage,
        setLocalBackgroundImage,
        textColor,
        buttonColorScheme,
        buttonColorSchemeClassName,
        avatarBg,
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `:root, [data-theme] {${Object.entries(
            generatedColors.chakraVariables ?? {}
          )
            .map(([key, value]) => `${key}: ${value};`)
            .join("")}
          ${Object.entries(generatedColors.tailwindVariables.light ?? {})
            .map(([key, value]) => `${key}: ${value};`)
            .join("")}
          ${textColor === "primary.800" ? `--banner-foreground:${bannerForegroundHSL[0].toFixed(2)} ${bannerForegroundHSL[1].toFixed(2)}% ${bannerForegroundHSL[2].toFixed(2)}%` : ""};--banner-opacity:${bannerOpacity};
          }
          :root[data-theme="dark"], [data-theme="dark"] {${Object.entries(
            generatedColors.tailwindVariables.dark ?? {}
          )
            .map(([key, value]) => `${key}: ${value};`)
            .join("")}`,
        }}
      ></style>
      {children}
    </ThemeContext.Provider>
  )
})

const useThemeContext = () => useContext(ThemeContext)

export { ThemeProvider, useThemeContext }
