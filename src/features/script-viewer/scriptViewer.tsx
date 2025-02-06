'use client'

import React, { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from '@/components/ui/badge'
import { AiOutlinePython } from 'react-icons/ai'
import { VscTerminalBash } from 'react-icons/vsc'
import { LiaHtml5 } from 'react-icons/lia'
import { BiLogoTypescript } from 'react-icons/bi'

interface Script {
  id: string
  name: string
  content: string
  language: string
  display_language: string
}

const sampleScripts: Script[] = [
  {
    id: '1',
    name: 'Count Files & Directories',
    content: "#!/bin/bash\n\n\
# ANSI color codes and cursor control\n\
RED='\\033[0;31m'\n\
GREEN='\\033[0;32m'\n\
YELLOW='\\033[1;33m'\n\
NC='\\033[0m' # No Color\n\
HIDE_CURSOR='\\033[?25l'\n\
SHOW_CURSOR='\\033[?25h'\n\n\
# Version of the script\n\
VERSION=\"1.3.0\"\n\n\
# Function to print usage\n\
print_usage() {\n\
    echo -e \"${YELLOW}Usage: \$0 [-p <directory>] [-s] [-l <level>] [-e <exclude-path>] [-h] [-v]${NC}\"\n\
    echo -e \"${YELLOW}Options:${NC}\"\n\
    echo -e \"  ${GREEN}-p <directory>${NC}  Directory to count files and folders in (default: ./)\"\n\
    echo -e \"  ${GREEN}-s${NC}            Display subfolders with file and folder counts\"\n\
    echo -e \"  ${GREEN}-l <level>${NC}    Display subfolders up to a specific depth level (default: all levels)\"\n\
    echo -e \"  ${GREEN}-e <exclude-path>${NC}  Exclude specific subdirectories or files (can be used multiple times)\"\n\
    echo -e \"  ${GREEN}-h${NC}            Display this help message\"\n\
    echo -e \"  ${GREEN}-v${NC}            Display version information\"\n\
}\n\n\
# Function to display a progress bar\n\
show_progress() {\n\
    local current=\"\$1\"\n\
    local total=\"\$2\"\n\
    local width=50\n\
    local progress=\$(( current * width / total ))\n\
    local remainder=\$(( width - progress ))\n\n\
    printf \"\\r[\"\n\
    for i in \$(seq 1 \$progress); do printf \"#\"; done\n\
    for i in \$(seq 1 \$remainder); do printf \" \"; done\n\
    printf \"] %3d%%\" \$(( current * 100 / total ))\n\
}\n\n\
# Function to check if an item should be excluded\n\
should_exclude() {\n\
    local item=\"\$1\"\n\
    for exclude in \"\${exclude_paths[@]}\"; do\n\
        if [[ \"\$item\" == *\"\$exclude\"* ]]; then\n\
            return 0\n\
        fi\n\
    done\n\
    return 1\n\
}\n\n\
# Function to count files and folders recursively within a given directory\n\
count_recursive() {\n\
    local directory=\"\$1\"\n\
    local file_count=0\n\
    local folder_count=0\n\n\
    # Count files and folders\n\
    while IFS= read -r item; do\n\
        if [ -f \"\$item\" ]; then\n\
            file_count=\$((file_count + 1))\n\
        elif [ -d \"\$item\" ]; then\n\
            folder_count=\$((folder_count + 1))\n\
        fi\n\
    done < <(find \"\$directory\" -type f -o -type d)\n\n\
    echo \"\$file_count,\$folder_count\"\n\
}\n\n\
# Function to count files and folders and list subfolders in the given directory\n\
count_files_and_folders() {\n\
    local directory=\"\$1\"\n\
    local display_subfolders=\"\$2\"\n\
    local level=\"\$3\"\n\
    shift 3\n\
    local excludes=(\"\$@\")\n\n\
    # Get the total number of items (files + folders) for progress tracking\n\
    local total_items=\$(find \"\$directory\" -maxdepth \"\$level\" \\( -type f -o -type d \\) | wc -l)\n\n\
    local file_count=0\n\
    local folder_count=0\n\
    local current_item=0\n\n\
    # Temporary file to hold the list of subfolders\n\
    local subfolder_list=\$(mktemp)\n\n\
    # Find all items within the specified depth\n\
    while IFS= read -r item; do\n\
        if should_exclude \"\$item\"; then\n\
            continue\n\
        fi\n\n\
        if [ -f \"\$item\" ]; then\n\
            file_count=\$((file_count + 1))\n\
        elif [ -d \"\$item\" ]; then\n\
            folder_count=\$((folder_count + 1))\n\
            if [ \"\$display_subfolders\" -eq 1 ]; then\n\
                # List subdirectories based on the specified depth level\n\
                find \"\$item\" -mindepth 1 -maxdepth \"\$level\" -type d >> \"\$subfolder_list\"\n\
            fi\n\
        fi\n\n\
        current_item=\$((current_item + 1))\n\
        show_progress \"\$current_item\" \"\$total_items\"\n\
    done < <(find \"\$directory\" -maxdepth \"\$level\" \\( -type f -o -type d \\))\n\n\
    # Print a new line after the progress bar is complete\n\
    printf \"\\r\\033[K\\n\"\n\n\
    # Print all subfolders with file and folder counts if the option is set\n\
    if [ \"\$display_subfolders\" -eq 1 ]; then\n\
        echo -e \"${GREEN}Subfolders:${NC}\"\n\n\
        # Print table header\n\
        printf \"%-50s %-10s %-10s\\n\" \"Directory\" \"Files\" \"Folders\"\n\
        printf \"%-50s %-10s %-10s\\n\" \"---------\" \"-----\" \"-------\"\n\n\
        while IFS= read -r folder; do\n\
            if should_exclude \"\$folder\"; then\n\
                continue\n\
            fi\n\
            # Count files and folders in each subfolder recursively\n\
            local counts=\$(count_recursive \"\$folder\" \"\${exclude_paths[@]}\")\n\
            local num_files=\$(echo \"\$counts\" | cut -d',' -f1)\n\
            local num_folders=\$(echo \"\$counts\" | cut -d',' -f2)\n\
            # Print directory and counts\n\
            printf \"%-50s %-10d %-10d\\n\" \"\$folder\" \"\$num_files\" \"\$num_folders\"\n\
        done < \"\$subfolder_list\"\n\
    fi\n\n\
    # Print a new line after all subfolders is complete\n\
    printf \"\\r\\033[K\\n\"\n\n\
    # Print total counts\n\
    echo -e \"${GREEN}Total files: ${file_count}${NC}\"\n\
    echo -e \"${GREEN}Total folders: ${folder_count}${NC}\"\n\n\
    # Clean up temporary file\n\
    rm \"\$subfolder_list\"\n\
}\n\n\
# Parse command-line arguments\n\
while getopts \":p:se:l:e:hv\" opt; do\n\
    case \$opt in\n\
        p)\n\
            directory_path=\"\$OPTARG\"\n\
            ;;\n\
        s)\n\
            display_subfolders=1\n\
            ;;\n\
        l)\n\
            level=\"\$OPTARG\"\n\
            ;;\n\
        e)\n\
            exclude_paths+=(\"\$OPTARG\")\n\
            ;;\n\
        h)\n\
            print_usage\n\
            exit 0\n\
            ;;\n\
        v)\n\
            echo -e \"${GREEN}Script Version: ${VERSION}${NC}\"\n\
            exit 0\n\
            ;;\n\
        *)\n\
            print_usage\n\
            exit 1\n\
            ;;\n\
    esac\n\
done\n\n\
# Default directory path if not provided\n\
directory_path=\${directory_path:-./}\n\n\
# Default value for display_subfolders if not set\n\
display_subfolders=\${display_subfolders:-0}\n\n\
# Default value for level if not set\n\
level=\${level:-999} # A high number to include all levels if not specified\n\n\
# Check if the directory exists\n\
if [ ! -d \"\$directory_path\" ]; then\n\
    echo -e \"${RED}Error: Directory '\$directory_path' does not exist.${NC}\"\n\
    exit 1\n\
fi\n\n\
# Hide the cursor\n\
echo -e \"\$HIDE_CURSOR\"\n\n\
# Trap to ensure cursor is shown when the script exits\n\
trap 'echo -e \"\$SHOW_CURSOR\"' EXIT\n\n\
# Record the start time\n\
start_time=\$(date +%s)\n\n\
# Call the function with the provided directory, display subfolders, and level\n\
count_files_and_folders \"\$directory_path\" \"\$display_subfolders\" \"\$level\" \"\${exclude_paths[@]}\"\n\n\
# Record the end time\n\
end_time=\$(date +%s)\n\n\
# Calculate the elapsed time\n\
elapsed_time=\$((end_time - start_time))\n\n\
# Print the execution time\n\
echo -e \"${GREEN}Execution time: \${elapsed_time} seconds${NC}\"\n\n\
# Restore the cursor at the end of the script\n\
echo -e \"\$SHOW_CURSOR\"",
    language: 'python',
    display_language: 'bash'
  },
  {
    id: '2',
    name: 'Typescript caches with Event Emitter',
    content: `
import { cache } from 'react';\nimport { EventEmitter } from "events";\n\nexport interface CacheEntry<T>{\n  value: T;\n  expiry: number;\n  priority?: number;\n}\n\nexport interface QueueOptions {\n  maxSize?: number;\n  priorityBasedEviction?: boolean;\n  maxListeners?: number;\n}\n\nconst DEFAULT_CACHE_EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours\nconst DEFAULT_MAX_QUEUE_SIZE = 100;\nconst DEFAULT_MAX_LISTENERS = 10;\n\nclass Cache {\n  protected static instance: Cache;\n  private cache: Record<string, CacheEntry<any>> = {};\n  private queue: string[] = [];\n  private options: QueueOptions;\n  private eventEmitter: EventEmitter;\n\n  // Change constructor from private to protected\n  protected constructor(options: QueueOptions = {}) {\n    this.options = {\n      maxSize: options.maxSize || DEFAULT_MAX_QUEUE_SIZE,\n      priorityBasedEviction: options.priorityBasedEviction || false,\n      maxListeners: options.maxListeners || DEFAULT_MAX_LISTENERS\n    };\n    this.eventEmitter = new EventEmitter();\n    this.eventEmitter.setMaxListeners(this.options.maxListeners);\n  }\n\n  public static getInstance(options?: QueueOptions): Cache {\n    if (!Cache.instance) {\n      Cache.instance = new Cache(options);\n    }\n    return Cache.instance;\n  }\n\n  public set<T>(key: string, value: T, priority?: number): void {\n    this.cleanUp();\n\n    //Remove existing key if it exists\n    if(this.has(key)){\n      this.remove(key);\n    }\n\n    this.manageQueueSize()\n\n    this.cache[key] = {\n      value,\n      expiry: Date.now() + DEFAULT_CACHE_EXPIRATION_TIME,\n      priority,\n    };\n\n    this.queue.push(key);\n\n    this.eventEmitter.emit('cacheEntryAdded', key, value );\n\n  }\n\n  public get<T>(key: string): T | undefined {\n    const cacheEntry = this.cache[key];\n    if (cacheEntry && cacheEntry.expiry > Date.now()) {\n      return this.cache[key].value as T;\n    }\n    return undefined;\n  }\n\n  public remove(key: string): void {\n    if(!this.has(key)){\n      return;\n    }\n\n    // Remove from cache\n    delete this.cache[key];\n\n    // Remove from queue\n    const index = this.queue.indexOf(key);\n    if (index > -1) {\n        this.queue.splice(index, 1);\n    }\n\n    // Emit event for cache entry removal\n    this.eventEmitter.emit('cacheEntryRemoved', key);\n\n  }\n\n  public clear(): void {\n    this.cache = {};\n    this.queue = [];\n    this.eventEmitter.emit('cachecleared');\n  }\n\n  public has(key: string): boolean {\n    return !!this.cache[key] && this.cache[key].expiry > Date.now();\n  }\n\n  private cleanUp(): void {\n    Object.keys(this.cache).forEach((key) => {\n      if (this.cache[key].expiry < Date.now()) {\n        this.remove(key);\n      }\n    });\n  }\n\n  private manageQueueSize(): void {\n    if (!this.options.maxSize) return\n\n    // If queue is at max size, remove entries\n    while (this.queue.length >= this.options.maxSize) {\n      if(this.options.priorityBasedEviction){\n        const keyToRemove = this.findLowestPriorityKey();\n        if(keyToRemove){\n          this.remove(keyToRemove);\n        }\n      } else {\n        const oldestKey = this.queue.shift();\n        if(oldestKey){\n          this.remove(oldestKey);\n        }\n      }\n    }\n  }\n\n  private findLowestPriorityKey(): string | undefined {\n    let lowestPriorityKey: string | undefined;\n    let lowestPriority: number | undefined;\n\n    for (const key of this.queue) {\n      const cacheEntry = this.cache[key];\n      if(cacheEntry && (lowestPriority === undefined ||\n        (cacheEntry.priority !== undefined && cacheEntry.priority < lowestPriority))) {\n          lowestPriority = cacheEntry.priority;\n          lowestPriorityKey = key;\n        }\n    }\n\n    return lowestPriorityKey;\n  }\n\n    // Safe emit method to handle potential memory leaks\n    private safeEmit(event: string, ...args: any[]): void {\n      try {\n          this.eventEmitter.emit(event, ...args);\n      } catch (error) {\n          console.warn(\`Event emission error for ${event}:\`, error);\n      }\n  }\n\n  // Enhanced event subscription methods\n  public on(event: 'cacheEntryAdded' | 'cacheEntryRemoved' | 'cachecleared',\n            listener: (...args: any[]) => void): () => void {\n      // Warn if approaching max listeners\n      const currentListenerCount = this.eventEmitter.listeners(event).length;\n      if (currentListenerCount >= (this.options.maxListeners || DEFAULT_MAX_LISTENERS) - 1) {\n          console.warn(\`Approaching max listeners limit for event: ${event}\`);\n      }\n\n      // Add listener\n      this.eventEmitter.on(event, listener);\n\n      // Return a method to remove the specific listener\n      return () => this.off(event, listener);\n  }\n\n  public off(event: 'cacheEntryAdded' | 'cacheEntryRemoved' | 'cachecleared',\n             listener: (...args: any[]) => void): void {\n      this.eventEmitter.off(event, listener);\n  }\n\n  // Method to get current listener count\n  public getListenerCount(event: string): number {\n      return this.eventEmitter.listeners(event).length;\n  }\n\n  // Method to remove all listeners for a specific event\n  public removeAllListeners(event?: string): void {\n      if (event) {\n          this.eventEmitter.removeAllListeners(event);\n      } else {\n          this.eventEmitter.removeAllListeners();\n      }\n  }\n\n  // Additional queue-related methods\n  public getQueueSize(): number {\n    return this.queue.length;\n  }\n\n  public getOldestKey(): string | undefined {\n    return this.queue[0];\n  }\n\n  public getNewestKey(): string | undefined {\n    return this.queue[this.queue.length - 1];\n  }\n\n}\n\nexport default Cache;\n`.trim(),
    language: 'typescript',
    display_language: 'typescript'
  },
  {
    id: '3',
    name: 'HTML Template',
    content: '<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Welcome</h1>\n  </body>\n</html>',
    language: 'html',
    display_language: 'html'
  }
]

export default function ScriptViewer() {
  const [selectedScript, setSelectedScript] = useState<Script | null>(null)

  return (
    <div className="flex w-full border shadow-lg"
      style={{ height: 'calc(100vh - 68px)' }}
    >
      <div className="w-1/4 bg-background p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Scripts</h2>
        <ScrollArea style={{ height: 'calc((100vh - 68px) - 8rem)' }}>
          <ul>
            {sampleScripts.map((script) => (
              <li
                key={script.id}
                className={`cursor-pointer p-2 rounded ${
                  selectedScript?.id === script.id ? 'bg-blue-200 dark:text-blue-300 text-primary dark:bg-primary' : 'hover:bg-gray-200 hover:dark:bg-gray-800'
                }`}
                onClick={() => setSelectedScript(script)}
              >
                {script.name}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
      <div className="bg-card w-3/4 p-4">
        {selectedScript ? (
          <>
            <h2 className="flex items-center gap-4 text-xl font-bold mb-4">
              {LanguagesIcons(selectedScript.display_language)}
              {selectedScript.name}
              <Badge>{selectedScript.display_language}</Badge></h2>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <Highlight
                theme={themes.nightOwl}
                code={selectedScript.content}
                language={selectedScript.language}
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-4 rounded`} style={style}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line, key: i })}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token, key })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </ScrollArea>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a script to view its content
          </div>
        )}
      </div>
    </div>
  )
}


const LanguagesIcons = (language: string) => {
  switch (language) {
    case 'python':
      return <AiOutlinePython className="w-6 h-6" />
    case 'bash':
      return <VscTerminalBash className="w-6 h-6"  />
    case 'html':
      return <LiaHtml5 className="h-6 w-6" />
    case 'typescript':
      return <BiLogoTypescript className="h-6 w-6" />

    default:
      return null
  }
}