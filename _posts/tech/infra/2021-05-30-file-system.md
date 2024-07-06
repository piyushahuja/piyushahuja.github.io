---
layout: post-normal
title: File System
date:   2021-05-30 09:00:11
tag: 
categories: infra
excerpt: 
permalink: /filesystem
comments: false

---
 
**A file system** determines how files are organised and retrieved from a physical storage medium (RAM disks, floppy disks, CD ROM, SSD). It is a structured representation of data and a set of metadata describing this data.

Each filesystem (used in the first sense) contains a control block, which holds information about that filesystem. The other blocks in the filesystem are inodes, which contain information about individual files, and data blocks, which contain the information stored in the individual files.

Properties of a filesystem:
* maximum partition size (FAT16 partitions are limited to a maximum of 2GB)
* maximum file name size 

timestamps: single or multiple (access, creation and modification)
 
Examples:

* Several Linux native filesystems are currently in widespread use, including ext2, ext3, ReiserFS, JFS and XFS. Additional native filesystems are in various stages of development. 
* Commonly used PC filesystems is FAT (File Allocation Table):  MS-DOS and Microsoft Windows 95, 98 and ME, NTFS is Microsoft's replacement for FAT: NT, 2000 and XP. 
* HFS (Hierarchical File System) is the native filesystem used on most Macintosh computers
* ISO 9660 is the standard filesystem for CDROMs.
*  Lustre is an open-source, object-based, distributed, parallel, clustered file system. POSIX compliant.
* HDFS [Network/Distributed like HDFS vs Clustered/Parallel like Lustre](https://unix.stackexchange.com/questions/216085/parallel-vs-distributed-vs-traditional-file-system) [More here](https://www.linkedin.com/pulse/parallel-file-system-vs-network-dummies-briti-gangopadhay/)



Linux filesystems differ from the DOS/Windows filesystems in a number of ways including 
*(1) allowing important system folders to span multiple partitions and multiple hard drives 
(2) adding additional information about files, including ownership and permissions (FAT filesystems can not accommodate information about files such as ownership and permissions.)
(3) establishing a number of standard folders for holding important components of the operating system.

Windows filesystem is ideal if you have a single user, accessing files in more-or-less the order they were created in, one after the other, with very few edits. Linux, however, was always intended as a multi-user system: It was guaranteed that you would have more than one user trying to access more than one file at the same time. So a different approach to storing files is needed. 


In contrast to the filesystems used for Microsoft Windows, fragmentation of files is usually not a major problem with Linux filesystems due to their fundamental differences in design (with multiple user in mind). (Fragmentation refers to parts of files becoming scattered around random, non-contiguous locations on a disk, resulting in reduced speed and reliability.) Thus, whereas the Microsoft Windows operating systems include utilities for defragmentation and encourage their regular use, such utilities are difficult to find for Linux. When Linux users who have come from the Windows world encounter sluggish performance, they are often tempted to attribute it to fragmentation; but it is much more likely the result of running short of memory (and using relatively slow swap disk space instead of RAM) and/or running too many processes (i.e., programs running in the background). [Why Linux No Need Defragmenting](http://geekblog.oneandoneis2.org/index.php/2006/08/17/why_doesn_t_linux_need_defragmenting 
)



The choice of filesystems can have very noticeable effects on performance, on recovery from errors, on compatibility with other operating systems and on limitations on partition and file sizes. 

* It is usually advantageous to use a journaling filesystem because of the greatly reduced startup times after system crashes vs static filesystems, such as ext2. In particular, if the system is halted without a proper shutdown, they guarantee consistency of the data and eliminate the need for a long and complex filesystem check during rebooting. The term journaling derives its name from the fact that a special file called a journal is used to keep track of the data that has been written to the hard disk. The choice of journaling filesystem can affect disk space availability because of the amount of space needed for the journal. This is a major consideration on small disks, such as Zip disks. For example, on a 100MB Zip disk, ext3fs and XFS each devote 4MB to their journals whereas ReiserFS devotes several times this amount to its journal.
* For the boot and root partitions, it can be advantageous to use an ext2 or ext3 filesystem because this will allow booting in an emergency even with an older kernel. 
* For other Linux partitions, ext3 or ReiserFS are usually the best choices, the former where ext2 compatibility is emphasized and the latter where performance is paramount. 
* When it is desired for partitions to be accessible to both Linux and Microsoft Windows, FAT should be selected.
* Which filesystems provide the best disk performance and minimize processor time? Some studies suggest that XFS and JFS produce the best throughput with small files (e.g., 100MB), while ext2, ext3 are the best with larger files (e.g., 1GB). 


Unlike most other operating systems, Linux supports a large number of foreign filesystems in addition to its native filesystems. This is possible because of the virtual file system layer, which was incorporated into Linux from its infancy and makes it easy to mount other filesystems. In addition to reading, foreign filesystem support also often includes writing, copying, erasing and other operations.


To the Linux kernel, the filesystem is flat. That is, it does not (1) have a hierarchical structure, (2) differentiate between directories, files or programs or (3) identify files by names. Instead, the kernel uses inodes to represent each file.

In Linux, everything is configured as a file. This includes not only text files, images and compiled programs (also referred to as executables), but also directories, partitions and hardware device drivers.
An inode is actually an entry in a list of inodes referred to as the inode list. Each inode contains information about a file including (1) its inode number (a unique identification number), (2) the owner and group associated with the file, (3) the file type (for example, whether it is a regular file or a directory), (4) the file's permission list, (5) the file creation, access and modification times, (6) the size of the file and (7) the disk address (i.e., the location on the disk where the file is physically stored).

[Is the file table in the filesystem or in the memory?](https://unix.stackexchange.com/questions/21325/is-the-file-table-in-the-filesystem-or-in-memory)












