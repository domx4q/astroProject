"""
This script should check git every 5 minutes for changes and update the repo if changes are found.
(use python 3.6)
"""

import os
import time
import subprocess


def update():
    print("Updating...")
    os.system("bash updateServer.sh")
    print("Done.")


def main():
    while True:
        print("Checking for updates...")
        try:
            subprocess.check_output("git fetch", shell=True)
            output = subprocess.check_output("git status", shell=True)
            output = output.decode("utf-8")
            if "Your branch is up to date" in output:
                print("No updates found.")
            else:
                update()
        except subprocess.CalledProcessError as e:
            print("Error: {}".format(e))
        print("Sleeping for 5 minutes...")
        time.sleep(300)

if __name__ == '__main__':
    main()