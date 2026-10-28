import type { ApiKeyAccess } from "@/entities/api-key-access/model/types";
import type { TeamMember } from "@/entities/team";
import { DropDown } from "@/shared/ui";

type TeamAccessProps = {
  apiKeyAccesses: ApiKeyAccess[];
  availableMembers: TeamMember[];
  isSubmitting?: boolean;
  onRevokeAccess: (ApiKeyAccess: ApiKeyAccess) => void
  onAddAccess: (teamMemberId: number) => void
};
export function TeamAccess({apiKeyAccesses, availableMembers, isSubmitting, onRevokeAccess, onAddAccess} : TeamAccessProps){

    return(
        <section aria-labelledby="manage-key-access-title" className="flex shrink-0 flex-col gap-2.5 border-t-2! border-dashed! pt-2.5  mb-4!">          
            <h2 className="my-2! text-center text-xl! leading-tight! text-text! max-[599px]:text-base!" id="manage-key-access-title">
                Team access
            </h2>
            <div  className="flex flex-col gap-1.5">
                {apiKeyAccesses.map((access, index) => {
                    return(                        
                        <div key={index} className="flex items-center justify-between gap-2 border-2! border-border! bg-surface-elevated! px-4! py-2!">
                            <span className="text-[11px]! leading-tight! text-text!">{access.displayName}</span>
                            <button
                                aria-label={`Revoke ${access.displayName}'s access`}
                                className="ml-auto shrink-0 cursor-pointer border-0! bg-transparent! p-0! text-right text-[11px]! leading-tight! text-error! underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={isSubmitting}
                                onClick={() => onRevokeAccess(access)}
                                type="button"
                            >
                                Revoke
                            </button>
                        </div>
                    )
                })}
            </div>
            <DropDown
                ariaLabel="Add access"
                className= "mt-2!"
                dropDownOptions={availableMembers}
                disabled={isSubmitting}
                getOptionsKey={(member) => member.id}
                getOptionsLabel={(member) => member.displayName}
                onSelect={(member) => {onAddAccess(member.id)}}
            />               
        </section>
    )
}