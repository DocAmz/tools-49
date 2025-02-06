import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function ProfileSelect({profile, onSelect} : { profile: string, onSelect: (profile: string)  => void }) {
  const [profiles, setProfiles] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>(profile);
  const [isLoading, setIsLoading ] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/profiles");
        const data = await response.json();

        console.log('data:', data)

        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally{
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      onSelect(selectedProfile);
    }
  }, [selectedProfile, onSelect]);

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="profileSelect" className="font-medium">
        Select ICC Profile:
      </label>
      <Select onValueChange={setSelectedProfile} value={selectedProfile}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Choose a profile --" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Color Profiles</SelectLabel>
                {
                  isLoading && <SelectItem disabled value={"loading"}>Loading profiles...</SelectItem>
                }
                {profiles.map((profile) => (
                  <SelectItem key={profile} value={profile}>
                    {profile}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
    </div>
  );
}
