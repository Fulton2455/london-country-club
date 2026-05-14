import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import CreateInviteButton from './CreateInviteButton'
import CopyLinkButton from './CopyLinkButton'

export default async function AdminInvitesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const dbUser = await prisma.user.findUnique({ where: { email: user!.email! } })

  const invites = await prisma.invite.findMany({
    orderBy: { createdAt: 'desc' },
    include: { createdBy: true },
  })

  const pending = invites.filter(i => !i.usedAt)
  const used = invites.filter(i => i.usedAt)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl text-[#1a2e1a]">Invites</h2>
        <CreateInviteButton adminId={dbUser!.id} />
      </div>

      <p className="text-sm text-gray-500">
        Generate invite links to send to prospective members. Each link can only be used once.
      </p>

      {/* Pending invites */}
      <div>
        <h3 className="font-serif text-xl text-[#1a2e1a] mb-3">Pending ({pending.length})</h3>
        {pending.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending invites.</p>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {pending.map(invite => (
              <div key={invite.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-mono text-gray-600">{invite.token}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Created {new Date(invite.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric'
                    })}
                    {invite.email && ` · For ${invite.email}`}
                  </p>
                </div>
                <CopyLinkButton token={invite.token} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Used invites */}
      {used.length > 0 && (
        <div>
          <h3 className="font-serif text-xl text-[#1a2e1a] mb-3 opacity-60">Used ({used.length})</h3>
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 opacity-50">
            {used.map(invite => (
              <div key={invite.id} className="px-5 py-3">
                <p className="text-sm font-mono text-gray-400 line-through">{invite.token}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Used {new Date(invite.usedAt!).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}