#!/bin/bash

#
# Delete all containers, used for development
#

# stop running containers
for container in $(lxc list -c n --format csv); do    
    lxc delete "$container" --force
done
