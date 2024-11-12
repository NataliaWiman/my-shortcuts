import Icon from "@/components/icons/Icon";
import Search from "@/components/Search";
import Shortcuts from "@/components/Shortcuts";

export default function Home() {
  return (
    <main className="flex justify-center p-4 pt-32 w-full min-h-screen">
      <div className="flex flex-col items-center w-[560px]">
        <div className="mb-10">
          <Icon name="google" />
        </div>
        <Search />
        <Shortcuts />
      </div>
    </main>
  );
}
