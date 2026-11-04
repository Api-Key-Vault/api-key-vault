import { useLoading } from "@/shared/lib";
import { ProgressBar } from "@/shared/ui";

type PageLoadingProps = {
    isLoading: boolean;
};
export function PageLoading({isLoading}: PageLoadingProps){
    const loadingProgress = useLoading(isLoading);

    return(
        <section className="flex flex-col gap-8 justify-center items-center w-full min-h-screen">
            <p className="text-primary-accent text-xl">LOADING... </p>
            <ProgressBar 
                progressValue={loadingProgress}
                size="md"
                ariaLabel={`Progress: ${loadingProgress}%`}
            />
        </section>
    )
}