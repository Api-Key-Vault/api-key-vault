import type { ApiKeyAccess } from "@/entities/api-key-access/model/types";
import type { TeamMember } from "@/entities/team";

type TeamAccessProps = {
  apiKeyAccesses: ApiKeyAccess[];
  availableMembers: TeamMember[];
  isSubmitting?: boolean;
  onRevokeAccess: (teamMemberId: number) => void
  onAddAccess: () => void
};
export function TeamAccess({apiKeyAccesses, availableMembers, isSubmitting, onRevokeAccess, onAddAccess} : TeamAccessProps){

    return(
        <section aria-labelledby="manage-key-access-title" className="flex shrink-0 flex-col gap-2.5">
            <h3 className="my-2! text-center text-[14px]! leading-tight! text-text! max-[599px]:text-[12px]!" id="manage-key-access-title">
                Team access
            </h3>
            <div  className="flex flex-col gap-1.5">
                {apiKeyAccesses.map((access, index) => {
                    return(                        
                        <div key={index} className="flex items-center justify-between gap-2 border-2! border-border! bg-surface-elevated! px-2! py-1!">
                            <span className="text-[11px]! leading-tight! text-text!">{access.displayName}</span>
                            <button
                                aria-label={`Revoke ${access.displayName}'s access`}
                                className="ml-auto shrink-0 cursor-pointer border-0! bg-transparent! p-0! text-right text-[11px]! leading-tight! text-error! underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={isSubmitting}
                                onClick={() => onRevokeAccess(access.teamMemberId)}
                                type="button"
                            >
                                Revoke
                            </button>
                        </div>
                    )
                })}
            </div>
            <button
                aria-label="Add team access"
                className="mx-auto! inline-flex h-6! w-6! shrink-0 cursor-pointer items-center justify-center border-2! border-border! bg-success! p-0! text-success-on-color! shadow-[2px_2px_0_var(--shadow)]! disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
                onClick={onAddAccess}
                type="button"
            >
                <span aria-hidden="true" className="pixelart-icons-font-plus text-[14px]! leading-none!" />
            </button>
            {/* Dropdown button with members to choose from */}
        </section>
    )
}