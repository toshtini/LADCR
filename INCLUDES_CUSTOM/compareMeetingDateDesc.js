function compareMeetingDateDesc(a,b) {
    if (a.getStartDate() == null && b.getStartDate() == null) return 0;
    if (a.getStartDate() == null && b.getStartDate() != null) return 1;
    if (a.getStartDate() != null && b.getStartDate() == null) return -1;
    return a.getStartDate().compareTo(b.getStartDate());
    
}
