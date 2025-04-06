"use client"

import AnimatedIcon from './animated-icon'
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi'

export default function SocialIcons() {
  const iconSize = 24

  return (
    <div className="flex gap-6 items-center">
      <AnimatedIcon
        icon={<FiGithub size={iconSize} />}
        href="https://github.com/yourusername"
        label="GitHub Profile"
      />
      <AnimatedIcon
        icon={<FiTwitter size={iconSize} />}
        href="https://twitter.com/yourusername"
        label="Twitter Profile"
      />
      <AnimatedIcon
        icon={<FiLinkedin size={iconSize} />}
        href="https://linkedin.com/in/yourusername"
        label="LinkedIn Profile"
      />
      <AnimatedIcon
        icon={<FiMail size={iconSize} />}
        href="mailto:your.email@example.com"
        label="Send Email"
      />
    </div>
  )
} 