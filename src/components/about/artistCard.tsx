'use client';
import Link from 'next/link'
import SocialButton from '../ui/social-button'

import { useState } from 'react';

function MemberCard({ member, index }: { member: typeof members[0], index: number }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className="group overflow-hidden"
      onClick={() => setIsActive(prev => !prev)}
    >
      <img
        className={`h-96 w-full rounded-md object-cover object-top transition-all duration-500
          ${isActive ? 'grayscale-0 h-[22.5rem] rounded-xl' : 'grayscale'}
          md:grayscale md:group-hover:grayscale-0 md:group-hover:h-[22.5rem] md:group-hover:rounded-xl`}
        src={member.avatar}
        alt={member.name}
        width="826"
        height="1239"
      />
      <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-medium transition-all duration-500">
            {member.role}
          </h3>
          <span className="text-xs">_0{index + 1}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span
            className={`inline-block text-sm transition-all duration-500
              ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}
              md:translate-y-6 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100`}
          >
            {member.name}
          </span>
          <SocialButton />
        </div>
      </div>
    </div>
  );
}

const members = [
    {
        name: 'Liam Brown',
        role: 'Founder - CEO',
        avatar: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        link: '#',
    },
    {
        name: 'Elijah Jones',
        role: 'Co-Founder - CTO',
        avatar: 'https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        link: '#',
    },
    {
        name: 'Isabella Garcia',
        role: 'Sales Manager',
        avatar: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        link: '#',
    },
    {
        name: 'Henry Lee',
        role: 'UX Engeneer',
        avatar: 'https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        link: '#',
    },
    {
        name: 'Ava Williams',
        role: 'Interaction Designer',
        avatar: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        link: '#',
    },
    {
        name: 'Olivia Miller',
        role: 'Visual Designer',
        avatar: 'https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        link: '#',
    },
]

export default function TeamSection() {
    return (
        <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
            <div className="mx-auto max-w-5xl border-t px-6">
                <span className="text-caption -ml-6 -mt-3.5 block w-max bg-gray-50 px-6 dark:bg-gray-950">Team</span>
                <div className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-24">
                    <div className="sm:w-2/5">
                        <h2 className="text-3xl font-bold sm:text-4xl">Our dream team</h2>
                    </div>
                    <div className="mt-6 sm:mt-0 font-sans">
                        <p>During the working process, we perform regular fitting with the client because he is the only person who can feel whether a new suit fits or not.</p>
                    </div>
                </div>
                <div className="mt-12 md:mt-24">
                    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        {members.map((member, index) => (
    <MemberCard key={index} member={member} index={index} />
  ))}
                    </div>
                </div>
            </div>
        </section>
    )
}