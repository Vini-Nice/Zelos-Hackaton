"use client";

import Image from "next/image";

export default function UserAvatar({ name, avatar, size = 40 }) {
  const initials = name ? name[0].toUpperCase() : "?";

  return (
    <div
      className={`w-${size} h-${size} rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-gray-700 font-semibold`}
      style={{ width: size, height: size }}
    >
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className="text-lg">{initials}</span>
      )}
    </div>
  );
}
