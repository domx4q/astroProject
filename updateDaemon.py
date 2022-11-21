"""
This script should chec git every 5 minutes for changes and update the repo if changes are found.
(use python 3.6)
"""

import os
import time
import subprocess


def update():
    print("Updating...")
    os.system("git pull")
    print("Done.")


def main():
    while True:
        print("Checking for updates...")
        p = subprocess.Popen(["git", "fetch"], stdout=subprocess.PIPE)
        out, err = p.communicate()
        if out:
            update()
        else:
            print("No updates found.")
        time.sleep(300)


if __name__ == '__main__':
    main()