'use client';
import { ReactNode, useState } from 'react';

type Member = {
  name: string;
  role: string;
  avatar: string;
  description: ReactNode;
};

const coreTeam: Member[] = [
  {
    name: 'Udit Shah',
    role: 'Director & Founder',
    avatar: 'https://firebasestorage.googleapis.com/v0/b/crestox-giok1.firebasestorage.app/o/founders%2Ffounder_udit.jpeg?alt=media',
    description: <>A CEPT graduate, Udit brings a strong business pedigree rooted in his family&apos;s ventures. He excels at forging partnerships, growing networks, and overseeing logistics. Udit&apos;s knack for Indian art and culture fuels Crestox&apos;s community building—connecting creators, collectors, and collaborators across the country.</>
  },
  {
    name: 'Prayush Shah',
    role: 'Director & Founder',
    avatar: 'https://firebasestorage.googleapis.com/v0/b/crestox-giok1.firebasestorage.app/o/founders%2Ffounder_prayush.jpeg?alt=media',
    description: <>A CEPT alum with a tech-savvy, entrepreneurial spirit, Prayush drives Crestox&apos;s product vision. From crafting seamless user journeys to building robust digital tools, he&apos;s the brains behind our platform&apos;s innovation. With a deep passion for Indian art and its future, Prayush ensures every feature empowers artists and collectors alike.</>
  }
];

const advisoryBoard: Member[] = [
  {
    name: 'Aatman Shah',
    role: 'Official CA',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    description: <><strong>Aatman Shah</strong> is a Chartered Accountant and public policy professional with experience in India&apos;s executive and legislative branches. He has served as <strong>Private Assistant to Finance Minister Nirmala Sitharaman</strong> and the <strong>Union Sports Minister</strong>. Aatman holds a <strong>Master&apos;s in Public Administration</strong> from the <strong>Lee Kuan Yew School of Public Policy, NUS</strong>.</>
  },
  {
    name: 'Saurin Shah',
    role: 'Official Lawyer',
    avatar: 'https://images.unsplash.com/photo-1566492031526-87ae0ee4fb15?q=80&w=800&auto=format&fit=crop',
    description: <>is the <strong>Managing Director of Nanavati &amp; Nanavati Advocates</strong>, one of India&apos;s most respected law firms, leading its operations for over six years. With extensive experience in corporate, commercial, and regulatory law, he brings strategic legal insight and governance expertise to emerging ventures. His leadership blends deep legal acumen with a forward-looking approach to business and innovation.</>
  },
  {
    name: 'Niharika Shah',
    role: 'Official Curator',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
    description: <>Niharika shah has served as the Director of the Hutheesing Art Gallery for over seven years, overseeing landmark exhibitions and record-breaking art sales. Under his leadership, the gallery has <strong>sold over 120 paintings, with individual works valued up to ₹2.5 crore.</strong> He brings deep expertise in art management, curation, and the business of culture to the startup ecosystem.</>
  },
  {
    name: 'Jay Shah',
    role: 'Official CA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    description: <>Jay Shah is a senior banking professional with over <strong>17 years of experience</strong> in <strong>wholesale banking</strong>, spanning financing, investments, trade, M&A, and cross-border transactions. Known for his strong financial acumen and strategic insight, Jay brings a deep understanding of markets, risk, and relationship management to the startup ecosystem.</>
  },
  {
    name: 'Chinmay Shah',
    role: 'Mentor',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
    description: <>Chinmay Shah is a third-generation entrepreneur and technology leader with over two decades of experience in digital transformation, IT strategy, and business operations. He has <strong>curated 17+ startups, managed partnerships with 250+ global brands</strong>, and led initiatives in automation, SaaS, and cloud ecosystems. A trusted advisor to global firms, Chinmay specializes in Build-Operate-Transfer models for super apps and digital platforms, combining innovation with sustainable tech-driven growth.</>
  }
];

function MemberCard({ member }: { member: Member }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className="group bg-gray-100 dark:bg-gray-900 rounded-3xl overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-800 transition-all hover:shadow-lg cursor-pointer"
      onClick={() => setIsActive(prev => !prev)}
    >
      <img
        src={member.avatar}
        alt={member.name}
        className={`w-full h-56 md:h-64 object-cover object-center transition-all duration-500
          ${isActive ? 'grayscale-0' : 'grayscale'}
          md:grayscale md:group-hover:grayscale-0`}
      />
      <div className="p-6 md:p-8 flex flex-col items-center flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
        <p className="text-gray-500 font-medium text-sm mb-6">{member.role}</p>
        <p className="text-[13px] text-gray-600 dark:text-gray-400 text-center leading-relaxed">
          {member.description}
        </p>
      </div>
    </div>
  );
}

export default function TeamSection() {
  return (
    <section className="bg-white py-16 md:py-32 dark:bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Core Team Section */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900 dark:text-white">Core Team</h2>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {coreTeam.map((member, index) => (
              <MemberCard key={index} member={member} />
            ))}
          </div>
        </div>

        {/* Advisory Board Section */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900 dark:text-white">Advisory Board</h2>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {advisoryBoard.map((member, index) => (
              <MemberCard key={index} member={member} />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}